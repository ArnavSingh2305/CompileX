import mongoose from "mongoose";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";
import Submission from "../models/Submission";
// GET /api/admin/users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select(
        "_id name email role isActive teacherId totalSolved totalPoints createdAt"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// POST /api/admin/teachers
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Teacher password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "teacher",
      isActive: true,
      isVerified: true,
      mustChangePassword: true,
      authProviders: ["local"],
    });

    return res.status(201).json({
      message: "Teacher account created successfully",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        mustChangePassword: teacher.mustChangePassword,
        isActive: teacher.isActive,
      },
    });
  } catch (error: any) {
    // Also handles a duplicate email if two requests arrive simultaneously.
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    console.error("Create teacher error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const assignStudentToTeacher = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { teacherId } = req.body;
    const { id: studentId } = req.params;

    if (!studentId || !mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    if (teacherId !== null && !mongoose.isValidObjectId(teacherId)) {
      return res.status(400).json({ message: "Invalid teacher ID" });
    }

    const student = await User.findOne({
      _id: studentId,
      role: "user",
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (teacherId === null) {
      student.teacherId = undefined;
      await student.save();

      return res.status(200).json({
        message: "Student unassigned successfully",
      });
    }

    const teacher = await User.findOne({
      _id: teacherId,
      role: "teacher",
      isActive: true,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Active teacher not found",
      });
    }

    student.teacherId = teacher._id;
    await student.save();

    return res.status(200).json({
      message: "Student assigned successfully",
      studentId: student._id,
      teacherId: teacher._id,
    });
  } catch (error) {
    console.error("Assign student error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUserStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false",
      });
    }

    if (id === req.userId && !isActive) {
      return res.status(400).json({
        message: "You cannot deactivate your own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin" && !isActive) {
      const activeAdminCount = await User.countDocuments({
        role: "admin",
        isActive: true,
      });

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          message: "Cannot deactivate the last active admin",
        });
      }
    }

    user.isActive = isActive;
    await user.save();

    return res.status(200).json({
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getAdminStats = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,
      activeUsers,
      totalSubmissions,
      acceptedSubmissions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "teacher" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ isActive: true }),
      Submission.countDocuments(),
      Submission.countDocuments({ status: "Accepted" }),
    ]);

    return res.status(200).json({
      stats: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalAdmins,
        activeUsers,
        totalSubmissions,
        acceptedSubmissions,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


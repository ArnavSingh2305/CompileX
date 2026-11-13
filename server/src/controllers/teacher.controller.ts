
import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/User";
import Submission from "../models/Submission";
import Problem from "../models/Problem";

// Get students assigned to the logged-in teacher
export const getAssignedStudents = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const students = await User.find({
      role: "user",
      teacherId: req.userId,
    })
      .select("_id name email isActive totalSolved totalPoints createdAt")
      .sort({ name: 1 });

    return res.status(200).json({
      totalStudents: students.length,
      students,
    });
  } catch (error) {
    console.error("Get assigned students error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get progress report for one assigned student
export const getStudentProgress = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    // Critical: verify that this student belongs to this teacher
    const student = await User.findOne({
      _id: id,
      role: "user",
      teacherId: req.userId,
    }).select("_id name email isActive totalPoints createdAt");

    if (!student) {
      return res.status(404).json({
        message: "Student not found or not assigned to you",
      });
    }

    const [totalSubmissions, acceptedSubmissions, solvedProblemIds, recentSubmissions] =
      await Promise.all([
        Submission.countDocuments({ user: student._id }),

        Submission.countDocuments({
          user: student._id,
          status: "Accepted",
        }),

        Submission.distinct("problem", {
          user: student._id,
          status: "Accepted",
        }),

        Submission.find({ user: student._id })
          .select("-code")
          .populate("problem", "title slug difficulty")
          .sort({ createdAt: -1 })
          .limit(10),
      ]);

    const solvedProblems = await Problem.find({
      _id: { $in: solvedProblemIds },
    }).select("difficulty");

    const difficultyBreakdown = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    };

    solvedProblems.forEach((problem) => {
      difficultyBreakdown[problem.difficulty]++;
    });

    const acceptanceRate =
      totalSubmissions === 0
        ? 0
        : Number(
            ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
          );

    return res.status(200).json({
      student,
      progress: {
        totalSubmissions,
        acceptedSubmissions,
        problemsSolved: solvedProblemIds.length,
        acceptanceRate,
        difficultyBreakdown,
        totalPoints: student.totalPoints,
      },
      recentSubmissions,
    });
  } catch (error) {
    console.error("Get student progress error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

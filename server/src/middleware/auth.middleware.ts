
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { UserRole } from "../models/User";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: "user" | "admin" | "teacher";
  teacherId?: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  let decoded: { id: string };

  // Step 1: Verify JWT
  try {
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "Authentication configuration error" });
      return;
    }

    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as { id: string };
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
    return;
  }

  // Step 2: Verify current account status and role from database
  try {
   const user = await User.findById(decoded.id).select(
      "role isActive teacherId mustChangePassword"
    );

    if (!user) {
      res.status(401).json({ message: "User account not found" });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: "Your account has been deactivated" });
      return;
    }
    if (user.mustChangePassword) {
      const allowedPaths = [
        "/api/auth/change-password",
        "/api/auth/me",
      ];

      if (!allowedPaths.includes(req.originalUrl.split("?")[0])) {
        res.status(403).json({
          message: "You must change your password before continuing",
          code: "PASSWORD_CHANGE_REQUIRED",
        });
        return;
      }
    }

    req.userId = user._id.toString();
    req.userRole = user.role;
    req.teacherId = user.teacherId?.toString();

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);

    res.status(500).json({
      message: "Authentication service error",
    });
  }
};


export const authorize = (...allowedRoles: UserRole[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.userId || !req.userRole) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    if (!allowedRoles.includes(req.userRole)) {
      res.status(403).json({
        message: "You do not have permission to access this resource",
      });
      return;
    }

    next();
  };
};


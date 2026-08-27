import { Response } from "express";
import Submission from "../models/Submission";
import { AuthRequest } from "../middleware/auth.middleware";

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalSubmissions = await Submission.countDocuments({ user: req.userId });

    const acceptedSubmissions = await Submission.find({
      user: req.userId,
      status: "Accepted",
    }).select("problem");

    const uniqueSolvedProblems = new Set(
      acceptedSubmissions.map((s) => s.problem.toString())
    );

    res.status(200).json({
      problemsSolved: uniqueSolvedProblems.size,
      totalSubmissions,
      currentStreak: 0, // placeholder — needs date-based logic, see note below
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
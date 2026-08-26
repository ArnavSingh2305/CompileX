import { Request, Response } from "express";
import Problem from "../models/Problem";

export const getProblems = async (req: Request, res: Response) => {
  try {
    const problems = await Problem.find().select(
      "title slug difficulty topics"
    );
    res.status(200).json(problems);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProblemBySlug = async (req: Request, res: Response) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug }).select(
      "title slug difficulty topics description constraints examples testCases"
    );

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Only send public (non-hidden) test cases to the frontend
    const publicProblem = {
      ...problem.toObject(),
      testCases: problem.testCases.filter((tc) => !tc.isHidden),
    };

    res.status(200).json(publicProblem);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
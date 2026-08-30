import { Request, Response } from "express";
import Problem from "../models/Problem";
import Submission from "../models/Submission";
import { executeCode } from "../services/execution";
import { AuthRequest } from "../middleware/auth.middleware";
import Bookmark from "../models/Bookmark";
import Article from "../models/Article";

export const getProblems = async (req: AuthRequest, res: Response) => {
  try {
    const { search, difficulty, topic, status } = req.query;

    const filter: any = {};
    if (search) filter.title = { $regex: search as string, $options: "i" };
    if (difficulty && difficulty !== "All") filter.difficulty = difficulty;
    if (topic) filter.topics = topic;

    const problems = await Problem.find(filter).select("title slug difficulty topics");

    const acceptedSubmissions = await Submission.find({
      user: req.userId,
      status: "Accepted",
    }).select("problem");
    const solvedProblemIds = new Set(
      acceptedSubmissions.map((s) => s.problem.toString())
    );

    const bookmarks = await Bookmark.find({ user: req.userId }).select("problem");
    const bookmarkedProblemIds = new Set(bookmarks.map((b) => b.problem.toString()));

    let problemsWithStatus = problems.map((problem) => ({
      ...problem.toObject(),
      solved: solvedProblemIds.has(problem._id.toString()),
      bookmarked: bookmarkedProblemIds.has(problem._id.toString()),
    }));

    if (status === "solved") {
      problemsWithStatus = problemsWithStatus.filter((p) => p.solved);
    } else if (status === "unsolved") {
      problemsWithStatus = problemsWithStatus.filter((p) => !p.solved);
    } else if (status === "bookmarked") {
      problemsWithStatus = problemsWithStatus.filter((p) => p.bookmarked);
    }

    res.status(200).json(problemsWithStatus);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProblemBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug }).select(
      "title slug difficulty topics description constraints examples testCases"
    );

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const bookmark = await Bookmark.findOne({ user: req.userId, problem: problem._id });

    const relatedArticles = await Article.find({
      relatedProblemSlugs: problem.slug,
    }).select("title slug summary");

    const publicProblem = {
      ...problem.toObject(),
      testCases: problem.testCases.filter((tc) => !tc.isHidden),
      bookmarked: !!bookmark,
      relatedArticles,
    };

    res.status(200).json(publicProblem);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const runAgainstPublicTests = async (req: AuthRequest, res: Response) => {
  try {
    const { language, code } = req.body;
    if (!language || !code) {
      return res.status(400).json({ message: "Language and code are required" });
    }

    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const publicTests = problem.testCases.filter((tc) => !tc.isHidden);
    const results = [];

    for (const tc of publicTests) {
      const execResult = await executeCode(language, code, tc.input);

      if (execResult.compileError) {
        return res.status(200).json({ compileError: execResult.compileError, results: [] });
      }

      if (execResult.signal) {
        results.push({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: `Runtime Error (signal: ${execResult.signal})`,
          passed: false,
        });
        continue;
      }

      const actualOutput = execResult.stdout.trim();
      const passed = actualOutput === tc.expectedOutput.trim();
      results.push({ input: tc.input, expectedOutput: tc.expectedOutput, actualOutput, passed });
    }

    res.status(200).json({ compileError: null, results });
  } catch (error: any) {
    res.status(500).json({ message: "Run failed", error: error.message });
  }
};
export const getAllTopics = async (req: AuthRequest, res: Response) => {
  try {
    const topics = await Problem.distinct("topics");
    res.status(200).json(topics.sort());
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
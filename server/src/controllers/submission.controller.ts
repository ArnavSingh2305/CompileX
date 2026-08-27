import { Response } from "express";
import Problem from "../models/Problem";
import Submission from "../models/Submission";
import { executeCode } from "../services/execution";
import { AuthRequest } from "../middleware/auth.middleware";

export const submitSolution = async (req: AuthRequest, res: Response) => {
  try {
    const { problemSlug, language, code } = req.body;

    if (!problemSlug || !language || !code) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const problem = await Problem.findOne({ slug: problemSlug });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const results = [];
    let passedCount = 0;
    let status: "Accepted" | "Wrong Answer" | "Compilation Error" | "Runtime Error" = "Accepted";

    for (const testCase of problem.testCases) {
      const execResult = await executeCode(language, code, testCase.input);

      if (execResult.compileError) {
        status = "Compilation Error";
        results.push({
          input: testCase.isHidden ? "Hidden" : testCase.input,
          expectedOutput: testCase.isHidden ? "Hidden" : testCase.expectedOutput,
          actualOutput: execResult.compileError,
          passed: false,
          isHidden: testCase.isHidden,
        });
        break; // stop on compile error, same for every test case anyway
      }

      const actual = execResult.stdout.trim();
      const expected = testCase.expectedOutput.trim();
      const passed = actual === expected;

      if (passed) passedCount++;

      results.push({
        input: testCase.isHidden ? "Hidden" : testCase.input,
        expectedOutput: testCase.isHidden ? "Hidden" : testCase.expectedOutput,
        actualOutput: testCase.isHidden ? (passed ? "Hidden" : "Hidden") : actual,
        passed,
        isHidden: testCase.isHidden,
      });
    }

    if (status !== "Compilation Error") {
      status = passedCount === problem.testCases.length ? "Accepted" : "Wrong Answer";
    }

    await Submission.create({
      user: req.userId,
      problem: problem._id,
      language,
      code,
      status,
      passedTestCases: passedCount,
      totalTestCases: problem.testCases.length,
    });

    res.status(200).json({
      status,
      passedTestCases: passedCount,
      totalTestCases: problem.testCases.length,
      results,
    });
  } catch (error: any) {
    console.error("Submission error:", error.message);
    res.status(500).json({ message: "Submission failed", error: error.message });
  }
};
export const getSubmissionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const submissions = await Submission.find({ user: req.userId })
      .populate("problem", "title slug difficulty")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(submissions);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
import { Response } from "express";
import Submission from "../models/Submission";
import Problem from "../models/Problem";
import { AuthRequest } from "../middleware/auth.middleware";

const calculateStreak = (activeDates: Set<string>): number => {
  const toKey = (d: Date) => d.toISOString().split("T")[0];

  let cursor = new Date();
  let cursorKey = toKey(cursor);

  // If no activity today, check yesterday — a streak shouldn't
  // reset to 0 the moment midnight passes before you've coded today.
  if (!activeDates.has(cursorKey)) {
    cursor.setDate(cursor.getDate() - 1);
    cursorKey = toKey(cursor);
    if (!activeDates.has(cursorKey)) return 0;
  }

  let streak = 0;
  while (activeDates.has(cursorKey)) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
    cursorKey = toKey(cursor);
  }
  return streak;
};

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const allSubmissions = await Submission.find({ user: req.userId }).populate(
      "problem",
      "difficulty topics"
    );

    const acceptedSubmissions = allSubmissions.filter((s) => s.status === "Accepted");

    const uniqueSolvedProblemIds = new Set(
      acceptedSubmissions.map((s) => s.problem._id.toString())
    );

    // --- Difficulty breakdown ---
    const allProblems = await Problem.find().select("difficulty topics");
    const difficultyTotals = { Easy: 0, Medium: 0, Hard: 0 };
    const difficultySolved = { Easy: 0, Medium: 0, Hard: 0 };

    allProblems.forEach((p) => {
      difficultyTotals[p.difficulty as "Easy" | "Medium" | "Hard"]++;
    });

    const solvedProblemsFull = allProblems.filter((p) =>
      uniqueSolvedProblemIds.has((p._id as any).toString())
    );
    solvedProblemsFull.forEach((p) => {
      difficultySolved[p.difficulty as "Easy" | "Medium" | "Hard"]++;
    });

    // --- Topic progress ---
    const topicTotals: Record<string, number> = {};
    const topicSolved: Record<string, number> = {};

    allProblems.forEach((p) => {
      p.topics.forEach((t) => {
        topicTotals[t] = (topicTotals[t] || 0) + 1;
      });
    });
    solvedProblemsFull.forEach((p) => {
      p.topics.forEach((t) => {
        topicSolved[t] = (topicSolved[t] || 0) + 1;
      });
    });

    const topicProgress = Object.keys(topicTotals).map((topic) => ({
      topic,
      solved: topicSolved[topic] || 0,
      total: topicTotals[topic],
      percentage: Math.round(((topicSolved[topic] || 0) / topicTotals[topic]) * 100),
    }));

    // --- Weak topics: attempted but low solve rate, at least 1 attempt ---
    const attemptedTopics = new Set<string>();
    allSubmissions.forEach((s) => {
      const prob = s.problem as any;
      if (prob?.topics) prob.topics.forEach((t: string) => attemptedTopics.add(t));
    });

    const weakTopics = topicProgress
      .filter((tp) => attemptedTopics.has(tp.topic) && tp.percentage < 50)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 3)
      .map((tp) => tp.topic);

    // --- Streak ---
    const activeDates = new Set(
      allSubmissions.map((s) => s.createdAt.toISOString().split("T")[0])
    );
    const currentStreak = calculateStreak(activeDates);

    res.status(200).json({
      problemsSolved: uniqueSolvedProblemIds.size,
      totalSubmissions: allSubmissions.length,
      currentStreak,
      difficultyBreakdown: {
        easy: { solved: difficultySolved.Easy, total: difficultyTotals.Easy },
        medium: { solved: difficultySolved.Medium, total: difficultyTotals.Medium },
        hard: { solved: difficultySolved.Hard, total: difficultyTotals.Hard },
      },
      topicProgress,
      weakTopics,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
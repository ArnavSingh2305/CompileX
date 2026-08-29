import { Response } from "express";
import Bookmark from "../models/Bookmark";
import Problem from "../models/Problem";
import { AuthRequest } from "../middleware/auth.middleware";

export const toggleBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const existing = await Bookmark.findOne({ user: req.userId, problem: problem._id });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ bookmarked: false });
    }

    await Bookmark.create({ user: req.userId, problem: problem._id });
    res.status(200).json({ bookmarked: true });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyBookmarks = async (req: AuthRequest, res: Response) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.userId })
      .populate("problem", "title slug difficulty topics")
      .sort({ createdAt: -1 });

    res.status(200).json(bookmarks.map((b) => b.problem));
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
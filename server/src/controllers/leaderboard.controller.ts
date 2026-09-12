import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

export const getLeaderboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const users = await User.find({ totalSolved: { $gt: 0 } })
      .select("name totalSolved totalPoints")
      .sort({
        totalPoints: -1,
        totalSolved: -1,
        createdAt: 1,
        });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: user.name,
      totalSolved: user.totalSolved,
      totalPoints: user.totalPoints,
    }));

    return res.status(200).json(leaderboard);
  } catch (error: any) {
    console.error("Leaderboard error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMyRank = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const me = await User.findById(req.userId).select(
        "totalSolved totalPoints createdAt"
    );

    if (!me) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const usersAhead = await User.countDocuments({
    $or: [
        {
        totalPoints: {
            $gt: me.totalPoints,
        },
        },
        {
        totalPoints: me.totalPoints,
        totalSolved: {
            $gt: me.totalSolved,
        },
        },
        {
        totalPoints: me.totalPoints,
        totalSolved: me.totalSolved,
        createdAt: {
            $lt: me.createdAt,
        },
        },
    ],
    });

    const totalUsers = await User.countDocuments({
      totalSolved: { $gt: 0 },
    });

    return res.status(200).json({
      rank: usersAhead + 1,
      totalUsers,
      totalSolved: me.totalSolved,
      totalPoints: me.totalPoints,
    });
  } catch (error: any) {
    console.error("My rank error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
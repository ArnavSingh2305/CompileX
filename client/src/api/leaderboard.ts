import api from "./axios";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  totalSolved: number;
  totalPoints: number;
}

export interface MyRank {
  rank: number;
  totalUsers: number;
  totalSolved: number;
  totalPoints: number;
}

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const res = await api.get<LeaderboardEntry[]>("/leaderboard");
  return res.data;
};

export const getMyRank = async (): Promise<MyRank> => {
  const res = await api.get<MyRank>("/leaderboard/me");
  return res.data;
};
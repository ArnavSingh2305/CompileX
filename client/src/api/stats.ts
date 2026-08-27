import api from "./axios";

export interface UserStats {
  problemsSolved: number;
  totalSubmissions: number;
  currentStreak: number;
}

export const getUserStats = async (): Promise<UserStats> => {
  const res = await api.get<UserStats>("/stats");
  return res.data;
};
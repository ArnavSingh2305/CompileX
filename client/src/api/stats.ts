import api from "./axios";

export interface TopicProgress {
  topic: string;
  solved: number;
  total: number;
  percentage: number;
}

export interface UserStats {
  problemsSolved: number;
  totalSubmissions: number;
  currentStreak: number;
  difficultyBreakdown: {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  };
  topicProgress: TopicProgress[];
  weakTopics: string[];
}

export const getUserStats = async (): Promise<UserStats> => {
  const res = await api.get<UserStats>("/stats");
  return res.data;
};
export const getActivityHeatmap = async (): Promise<Record<string, number>> => {
  const res = await api.get<Record<string, number>>("/stats/activity");
  return res.data;
};
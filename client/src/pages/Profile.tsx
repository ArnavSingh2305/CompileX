import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserStats, getActivityHeatmap } from "../api/stats";
import type { UserStats } from "../api/stats";

import { getMyRank } from "../api/leaderboard";
import type { MyRank } from "../api/leaderboard";
import { ScrollReveal } from "../components/ScrollReveal";
import { DifficultyRadialChart } from "../components/DifficultyRadialChart";
import { TopicHeatmap } from "../components/TopicHeatmap";
import { ActivityGrid } from "../components/ActivityGrid";

export const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [rank, setRank] = useState<MyRank | null>(null);
  const [activity, setActivity] = useState<Record<string, number>>({});

  useEffect(() => {
    getUserStats().then(setStats).catch(() => {});
    getMyRank().then(setRank).catch(() => {});
    getActivityHeatmap().then(setActivity).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-950 p-8">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Problems Solved</p>
              <p className="text-2xl font-bold">{stats?.problemsSolved ?? "—"}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Total Points</p>
              <p className="text-2xl font-bold">{rank?.totalPoints ?? "—"}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Current Streak</p>
              <p className="text-2xl font-bold">{stats?.currentStreak ? `🔥 ${stats.currentStreak}` : "0"}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Global Rank</p>
              <p className="text-2xl font-bold">{rank ? `#${rank.rank}` : "—"}</p>
            </div>
          </div>
        </ScrollReveal>

        {stats && (
          <ScrollReveal delay={200}>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="glass-card rounded-2xl p-5">
                <h2 className="font-semibold mb-4">Difficulty</h2>
                <div className="flex items-center gap-6">
                  <DifficultyRadialChart
                    easy={stats.difficultyBreakdown.easy}
                    medium={stats.difficultyBreakdown.medium}
                    hard={stats.difficultyBreakdown.hard}
                  />
                </div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <h2 className="font-semibold mb-4">Topics</h2>
                <TopicHeatmap topics={stats.topicProgress} />
              </div>
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal delay={300}>
          <div className="glass-card rounded-2xl p-5">
            <h2 className="font-semibold mb-4">Activity</h2>
            <ActivityGrid activity={activity} />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
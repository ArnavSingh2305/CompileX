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
import { Page } from "../components/ui/Page";

const difficultyRows = [
  { key: "easy", label: "Easy", dot: "bg-[rgb(var(--t-green-fg))]" },
  { key: "medium", label: "Medium", dot: "bg-[rgb(var(--t-orange-fg))]" },
  { key: "hard", label: "Hard", dot: "bg-[rgb(var(--t-red-fg))]" },
] as const;

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

  const avatar = (
    <span className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-[rgb(var(--t-blue-bg))] text-3xl font-semibold text-[rgb(var(--t-blue-fg))]">
      {user?.name?.[0]?.toUpperCase() || "?"}
    </span>
  );

  const statCards = [
    { label: "Problems Solved", value: stats?.problemsSolved ?? "—" },
    { label: "Total Points", value: rank?.totalPoints ?? "—" },
    { label: "Current Streak", value: stats?.currentStreak ? `🔥 ${stats.currentStreak}` : "0" },
    { label: "Global Rank", value: rank ? `#${rank.rank}` : "—" },
  ];

  return (
    <Page icon={avatar} title={user?.name} description={user?.email} width="lg">
      <ScrollReveal delay={50}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.label} className="card p-4">
              <p className="text-xs font-medium text-fg/50">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {stats && (
        <ScrollReveal delay={100}>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <section className="card p-5">
              <h2 className="mb-4 text-sm font-semibold">Difficulty</h2>
              <div className="flex items-center gap-5">
                <div className="w-36 shrink-0">
                  <DifficultyRadialChart
                    easy={stats.difficultyBreakdown.easy}
                    medium={stats.difficultyBreakdown.medium}
                    hard={stats.difficultyBreakdown.hard}
                  />
                </div>
                <ul className="flex-1 space-y-2.5 text-sm">
                  {difficultyRows.map(({ key, label, dot }) => {
                    const d = stats.difficultyBreakdown[key];
                    return (
                      <li key={key} className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${dot}`} />
                        <span className="flex-1 text-fg/80">{label}</span>
                        <span className="tabular-nums text-fg/50">
                          {d.solved}/{d.total}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            <section className="card p-5">
              <h2 className="mb-4 text-sm font-semibold">Topics</h2>
              <TopicHeatmap topics={stats.topicProgress} />
            </section>
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal delay={150}>
        <section className="card mt-4 p-5">
          <h2 className="mb-4 text-sm font-semibold">Activity</h2>
          <ActivityGrid activity={activity} />
        </section>
      </ScrollReveal>
    </Page>
  );
};

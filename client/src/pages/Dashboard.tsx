import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserStats } from "../api/stats";
import type { UserStats } from "../api/stats";
import { getSubmissionHistory } from "../api/submissions";
import type { SubmissionHistoryItem } from "../api/submissions";
import { getMyRank } from "../api/leaderboard";
import type { MyRank } from "../api/leaderboard";
import { CountUp } from "../components/CountUp";
import { ScrollReveal } from "../components/ScrollReveal";
import { DifficultyRadialChart } from "../components/DifficultyRadialChart";
import { TopicHeatmap } from "../components/TopicHeatmap";
import { Page } from "../components/ui/Page";
import { Tag } from "../components/ui/Tag";
import { Callout } from "../components/ui/Callout";
import { statusTone } from "../components/ui/tones";

const StatCard = ({ label, to, children }: { label: string; to?: string; children: ReactNode }) => {
  const inner = (
    <>
      <p className="text-xs font-medium text-fg/50">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{children}</p>
    </>
  );

  return to ? (
    <Link to={to} className="card card-hover block p-4">
      {inner}
    </Link>
  ) : (
    <div className="card p-4">{inner}</div>
  );
};

const difficultyRows = [
  { key: "easy", label: "Easy", dot: "bg-[rgb(var(--t-green-fg))]" },
  { key: "medium", label: "Medium", dot: "bg-[rgb(var(--t-orange-fg))]" },
  { key: "hard", label: "Hard", dot: "bg-[rgb(var(--t-red-fg))]" },
] as const;

export const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<SubmissionHistoryItem[]>([]);
  const [myRank, setMyRank] = useState<MyRank | null>(null);

  useEffect(() => {
    getUserStats()
      .then(setStats)
      .catch(() => {});

    getSubmissionHistory()
      .then((d) => setRecentSubmissions(d.slice(0, 5)))
      .catch(() => {});

    getMyRank()
      .then(setMyRank)
      .catch(() => {});
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Page
      icon="👋"
      title={`${greeting()}, ${user?.name}`}
      description="Keep practicing. Consistency beats intensity."
      width="lg"
    >
      <ScrollReveal delay={50}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Problems Solved">
            <CountUp end={stats?.problemsSolved ?? 0} />
          </StatCard>
          <StatCard label="Submissions">
            <CountUp end={stats?.totalSubmissions ?? 0} />
          </StatCard>
          <StatCard label="Current Streak">
            {stats?.currentStreak ? `🔥 ${stats.currentStreak}` : "0"}
          </StatCard>
          <StatCard label="Global Rank" to="/leaderboard">
            {myRank ? `#${myRank.rank}` : "—"}
          </StatCard>
        </div>
      </ScrollReveal>

      {stats && (
        <ScrollReveal delay={100}>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <section className="card p-5">
              <h2 className="mb-4 text-sm font-semibold">Difficulty distribution</h2>
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
              <h2 className="mb-4 text-sm font-semibold">Topic proficiency</h2>
              <TopicHeatmap topics={stats.topicProgress} />
            </section>
          </div>
        </ScrollReveal>
      )}

      {stats && stats.weakTopics.length > 0 && (
        <ScrollReveal delay={150}>
          <Callout tone="orange" icon="💡" className="mt-4">
            <p className="font-medium">Weak topics — worth revisiting</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {stats.weakTopics.map((topic) => (
                <Link key={topic} to={`/problems?topic=${encodeURIComponent(topic)}`}>
                  <Tag tone="orange" className="!bg-bg/60 transition-opacity hover:opacity-70">
                    {topic}
                  </Tag>
                </Link>
              ))}
            </div>
          </Callout>
        </ScrollReveal>
      )}

      <ScrollReveal delay={200}>
        <h2 className="mb-3 mt-10 text-lg font-semibold">Recent submissions</h2>

        {recentSubmissions.length === 0 ? (
          <p className="text-sm text-fg/60">
            No submissions yet — head to{" "}
            <Link to="/problems" className="font-medium text-link hover:underline">
              Problems
            </Link>{" "}
            to get started.
          </p>
        ) : (
          <div className="card divide-y divide-fg/[0.07] overflow-hidden">
            {recentSubmissions.map((sub) => (
              <Link
                key={sub._id}
                to={`/submissions/${sub._id}`}
                className="card-hover flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{sub.problem.title}</p>
                  <p className="mt-0.5 text-xs text-fg/50">
                    {sub.language} · {new Date(sub.createdAt).toLocaleString()}
                  </p>
                </div>
                <Tag tone={statusTone(sub.status)}>{sub.status}</Tag>
              </Link>
            ))}
          </div>
        )}
      </ScrollReveal>
    </Page>
  );
};

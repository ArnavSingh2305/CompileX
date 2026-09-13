import { useEffect, useState } from "react";
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

const statusColor: Record<string, string> = {
  Accepted: "text-green-600 dark:text-green-400",
  "Wrong Answer": "text-red-600 dark:text-red-400",
  "Compilation Error": "text-orange-600 dark:text-orange-400",
  "Runtime Error": "text-orange-600 dark:text-orange-400",
};

export const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<
    SubmissionHistoryItem[]
  >([]);
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
    <div className="min-h-screen bg-ivory dark:bg-navy-950 bg-grid p-8">
      <div className="max-w-5xl mx-auto">
        {/* Greeting */}
        <ScrollReveal>
          <h1 className="text-3xl font-bold mb-1">
            {greeting()},{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              {user?.name}
            </span>{" "}
            👋
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Keep practicing. Consistency beats intensity.
          </p>
        </ScrollReveal>

        {/* Top stat cards */}
        <ScrollReveal delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Problems Solved
              </p>

              <p className="text-2xl font-bold">
                <CountUp end={stats?.problemsSolved ?? 0} />
              </p>
            </div>

            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Submissions
              </p>

              <p className="text-2xl font-bold">
                <CountUp end={stats?.totalSubmissions ?? 0} />
              </p>
            </div>

            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Current Streak
              </p>

              <p className="text-2xl font-bold">
                {stats?.currentStreak
                  ? `🔥 ${stats.currentStreak}`
                  : "0"}
              </p>
            </div>

            <Link
              to="/leaderboard"
              className="glass-card rounded-xl p-4 hover:-translate-y-0.5 transition-transform"
            >
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Global Rank
              </p>

              <p className="text-2xl font-bold">
                {myRank ? `#${myRank.rank}` : "—"}
              </p>
            </Link>
          </div>
        </ScrollReveal>

        {/* Difficulty + Topic */}
        {stats && (
          <ScrollReveal delay={200}>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Difficulty Distribution */}
              <div className="glass-card rounded-2xl p-5">
                <h2 className="font-semibold mb-4">
                  Difficulty Distribution
                </h2>

                <div className="flex items-center gap-6">
                  <DifficultyRadialChart
                    easy={stats.difficultyBreakdown.easy}
                    medium={stats.difficultyBreakdown.medium}
                    hard={stats.difficultyBreakdown.hard}
                  />

                  <div className="space-y-2 text-sm">
                    {(
                      ["easy", "medium", "hard"] as const
                    ).map((d) => {
                      const dot =
                        d === "easy"
                          ? "bg-green-500"
                          : d === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500";

                      const data = stats.difficultyBreakdown[d];

                      return (
                        <div
                          key={d}
                          className="flex items-center gap-2"
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${dot}`}
                          />

                          <span className="capitalize w-16">
                            {d}
                          </span>

                          <span className="text-slate-500">
                            {data.solved}/{data.total}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Topic Proficiency */}
              <div className="glass-card rounded-2xl p-5">
                <h2 className="font-semibold mb-4">
                  Topic Proficiency
                </h2>

                <TopicHeatmap topics={stats.topicProgress} />
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Weak Topics */}
        {stats && stats.weakTopics.length > 0 && (
          <ScrollReveal delay={250}>
            <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-4 mb-8">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-2">
                Weak Topics — worth revisiting
              </p>

              <div className="flex gap-2 flex-wrap">
                {stats.weakTopics.map((topic) => (
                  <Link
                    key={topic}
                    to={`/problems?topic=${encodeURIComponent(
                      topic
                    )}`}
                    className="text-sm bg-white dark:bg-navy-900 border border-orange-300 dark:border-orange-500/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full hover:scale-105 transition-transform"
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Recent Submissions */}
        <ScrollReveal delay={300}>
          <h2 className="text-xl font-semibold mb-3">
            Recent Submissions
          </h2>

          {recentSubmissions.length === 0 ? (
            <p className="text-slate-500">
              No submissions yet — head to{" "}
              <Link
                to="/problems"
                className="text-accent-purple hover:underline"
              >
                Problems
              </Link>{" "}
              to get started.
            </p>
          ) : (
            <div className="glass-card rounded-2xl divide-y divide-slate-200/60 dark:divide-white/5">
              {recentSubmissions.map((sub) => (
                <Link
                  key={sub._id}
                  to={`/submissions/${sub._id}`}
                  className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition rounded-2xl"
                >
                  <div>
                    <p className="font-medium">
                      {sub.problem.title}
                    </p>

                    <p className="text-xs text-slate-500">
                      {sub.language} ·{" "}
                      {new Date(sub.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`text-sm font-medium ${
                      statusColor[sub.status] || ""
                    }`}
                  >
                    {sub.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
};
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserStats } from "../api/stats";
import type { UserStats } from "../api/stats";
import { getSubmissionHistory } from "../api/submissions";
import type { SubmissionHistoryItem } from "../api/submissions";

const statusColor: Record<string, string> = {
  Accepted: "text-green-600",
  "Wrong Answer": "text-red-600",
  "Compilation Error": "text-orange-600",
  "Runtime Error": "text-orange-600",
};

export const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<
    SubmissionHistoryItem[]
  >([]);

  useEffect(() => {
    getUserStats()
      .then(setStats)
      .catch(() => {});

    getSubmissionHistory()
      .then((data) => setRecentSubmissions(data.slice(0, 5)))
      .catch(() => {});
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user?.name}</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-sm text-slate-500">Problems Solved</p>
          <p className="text-2xl font-bold">{stats?.problemsSolved ?? "—"}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-sm text-slate-500">Submissions</p>
          <p className="text-2xl font-bold">{stats?.totalSubmissions ?? "—"}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-sm text-slate-500">Current Streak</p>
          <p className="text-2xl font-bold">
            {stats?.currentStreak ? `🔥 ${stats.currentStreak}` : "0"}
          </p>
        </div>
      </div>

      {stats && (
        <>
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-3">Difficulty Breakdown</h2>
            <div className="space-y-2">
              {(["easy", "medium", "hard"] as const).map((diff) => {
                const d = stats.difficultyBreakdown[diff];
                const pct = d.total > 0 ? (d.solved / d.total) * 100 : 0;
                const color = diff === "easy" ? "bg-green-500" : diff === "medium" ? "bg-yellow-500" : "bg-red-500";
                return (
                  <div key={diff}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{diff}</span>
                      <span>{d.solved} / {d.total}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded h-2">
                      <div className={`h-2 rounded ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-3">Topic Progress</h2>
            <div className="space-y-2">
              {stats.topicProgress.map((tp) => (
                <div key={tp.topic}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{tp.topic}</span>
                    <span>{tp.solved} / {tp.total}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded h-2">
                    <div className="h-2 rounded bg-blue-500" style={{ width: `${tp.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {stats.weakTopics.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h2 className="font-semibold mb-2 text-orange-800">Weak Topics</h2>
              <div className="flex gap-2 flex-wrap">
                {stats.weakTopics.map((topic) => (
                  <Link
                    key={topic}
                    to={`/problems?topic=${encodeURIComponent(topic)}`}
                    className="text-sm bg-white border border-orange-300 text-orange-700 px-3 py-1 rounded hover:bg-orange-100"
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <h2 className="text-xl font-semibold mb-3">Recent Submissions</h2>
      {recentSubmissions.length === 0 ? (
        <p className="text-slate-500">
          No submissions yet — head to{" "}
          <Link to="/problems" className="text-blue-600 hover:underline">DSA</Link> to get started.
        </p>
      ) : (
        <div className="bg-white shadow rounded-lg divide-y">
          {recentSubmissions.map((sub) => (
            <Link
              key={sub._id}
              to={`/submissions/${sub._id}`}
              className="flex justify-between items-center p-3 hover:bg-slate-50"
            >
              <div>
                <p className="font-medium">{sub.problem.title}</p>
                <p className="text-xs text-slate-500">{sub.language} · {new Date(sub.createdAt).toLocaleString()}</p>
              </div>
              <span className={`text-sm font-medium ${statusColor[sub.status] || ""}`}>
                {sub.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
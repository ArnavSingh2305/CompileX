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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, {user?.name}
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-sm text-slate-500">Problems Solved</p>
          <p className="text-2xl font-bold">
            {stats?.problemsSolved ?? "—"}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-sm text-slate-500">Submissions</p>
          <p className="text-2xl font-bold">
            {stats?.totalSubmissions ?? "—"}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-sm text-slate-500">Current Streak</p>
          <p className="text-2xl font-bold">
            {stats?.currentStreak ?? "—"}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">
        Recent Submissions
      </h2>

      {recentSubmissions.length === 0 ? (
        <p className="text-slate-500">
          No submissions yet — head to{" "}
          <Link
            to="/problems"
            className="text-blue-600 hover:underline"
          >
            DSA
          </Link>{" "}
          to get started.
        </p>
      ) : (
        <div className="bg-white shadow rounded-lg divide-y">
          {recentSubmissions.map((sub) => (
            <Link
              key={sub._id}
              to={`/problems/${sub.problem.slug}`}
              className="flex justify-between items-center p-3 hover:bg-slate-50"
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
    </div>
  );
};
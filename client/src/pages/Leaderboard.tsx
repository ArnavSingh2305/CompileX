import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getLeaderboard } from "../api/leaderboard";
import type { LeaderboardEntry } from "../api/leaderboard";

const medalFor = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
};

export const Leaderboard = () => {
  const { user } = useAuth();

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getLeaderboard()
      .then(setEntries)
      .catch(() => {
        setError("Failed to load leaderboard");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        🏆 Leaderboard
      </h1>

      {entries.length === 0 ? (
        <p className="text-slate-500">
          No one has solved a problem yet — be the first!
        </p>
      ) : (
        <div className="bg-white shadow rounded-lg divide-y">
          {entries.map((entry) => {
            const isMe = entry.userId === user?.id;
            const medal = medalFor(entry.rank);

            return (
              <div
                key={entry.userId}
                className={`flex items-center justify-between p-4 ${
                  isMe ? "bg-blue-50" : ""
                } ${
                  entry.rank <= 3 ? "font-semibold" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center text-slate-500">
                    {medal || `#${entry.rank}`}
                  </span>

                  <span>
                    {entry.name}

                    {isMe && (
                      <span className="text-blue-600 text-xs ml-2">
                        (You)
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex gap-6 text-sm text-slate-600">
                  <span>
                    {entry.totalSolved} solved
                  </span>

                  <span className="font-bold text-blue-600">
                    {entry.totalPoints} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
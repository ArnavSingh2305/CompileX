import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getLeaderboard } from "../api/leaderboard";
import type { LeaderboardEntry } from "../api/leaderboard";
import { ScrollReveal } from "../components/ScrollReveal";

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
  const [tab, setTab] = useState<"global" | "friends" | "monthly">("global");

  useEffect(() => {
    getLeaderboard()
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-950 p-8">
      <div className="max-w-2xl mx-auto">
        <ScrollReveal>
          <h1 className="text-3xl font-bold mb-1">🏆 Leaderboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Practice. Improve. Climb the ranks.</p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="flex gap-1 mb-6 glass-card rounded-xl p-1 w-fit">
            {(["global", "friends", "monthly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
                  tab === t ? "bg-gradient-brand text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {tab !== "global" ? (
          <ScrollReveal delay={150}>
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-slate-400 text-sm">
                {tab === "friends" ? "Friends leaderboard" : "Monthly leaderboard"} is coming soon.
              </p>
            </div>
          </ScrollReveal>
        ) : loading ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-slate-400 text-sm">No one has solved a problem yet — be the first!</p>
        ) : (
          <>
            {/* Top 3 podium cards */}
            {topThree.length > 0 && (
              <ScrollReveal delay={150}>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {topThree.map((entry) => {
                    const isMe = entry.name === user?.name;
                    const isFirst = entry.rank === 1;
                    return (
                      <div
                        key={entry.userId}
                        className={`glass-card rounded-2xl p-4 text-center ${isFirst ? "scale-105 ring-1 ring-accent-purple/30" : ""} ${isMe ? "border-accent-purple/40" : ""}`}
                      >
                        <div className="text-3xl mb-1">{medalFor(entry.rank)}</div>
                        <p className="font-semibold text-sm truncate">{entry.name}</p>
                        {isMe && <span className="text-[10px] text-accent-purple">(You)</span>}
                        <p className="text-xs text-slate-500 mt-1">{entry.totalSolved} solved</p>
                        <p className="font-bold text-accent-purple">{entry.totalPoints} pts</p>
                      </div>
                    );
                  })}
                </div>
              </ScrollReveal>
            )}

            {/* Rest of the board */}
            {rest.length > 0 && (
              <ScrollReveal delay={250}>
                <div className="glass-card rounded-2xl divide-y divide-slate-200/60 dark:divide-white/5">
                  {rest.map((entry) => {
                    const isMe = entry.name === user?.name;
                    return (
                      <div
                        key={entry.userId}
                        className={`flex items-center justify-between p-4 transition ${isMe ? "bg-accent-purple/5" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 text-center text-slate-400 font-medium">#{entry.rank}</span>
                          <span>
                            {entry.name}
                            {isMe && <span className="text-accent-purple text-xs ml-2">(You)</span>}
                          </span>
                        </div>
                        <div className="flex gap-6 text-sm text-slate-500">
                          <span>{entry.totalSolved} solved</span>
                          <span className="font-semibold text-accent-purple">{entry.totalPoints} pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollReveal>
            )}
          </>
        )}
      </div>
    </div>
  );
};
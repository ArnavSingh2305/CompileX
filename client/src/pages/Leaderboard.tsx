import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getLeaderboard } from "../api/leaderboard";
import type { LeaderboardEntry } from "../api/leaderboard";
import { ScrollReveal } from "../components/ScrollReveal";
import { Page } from "../components/ui/Page";
import { Tag } from "../components/ui/Tag";
import { Callout } from "../components/ui/Callout";

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
    <Page icon="🏆" title="Leaderboard" description="Practice. Improve. Climb the ranks.">
      <ScrollReveal delay={50}>
        <div className="mb-6 flex gap-5 border-b border-fg/10">
          {(["global", "friends", "monthly"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTab(t)}
              className={`view-tab capitalize ${tab === t ? "view-tab-active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {tab !== "global" ? (
        <ScrollReveal delay={100}>
          <Callout icon="🚧">
            {tab === "friends" ? "Friends leaderboard" : "Monthly leaderboard"} is coming soon.
          </Callout>
        </ScrollReveal>
      ) : loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-12" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-fg/50">No one has solved a problem yet — be the first!</p>
      ) : (
        <>
          {topThree.length > 0 && (
            <ScrollReveal delay={100}>
              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {topThree.map((entry) => {
                  const isMe = entry.name === user?.name;
                  return (
                    <div
                      key={entry.userId}
                      className={`card p-4 text-center ${
                        isMe ? "!border-accent/50 bg-accent/[0.04]" : ""
                      }`}
                    >
                      <div className="mb-1 text-3xl">{medalFor(entry.rank)}</div>
                      <p className="truncate text-sm font-semibold">{entry.name}</p>
                      {isMe && (
                        <Tag tone="blue" className="mt-1">
                          You
                        </Tag>
                      )}
                      <p className="mt-2 text-xs text-fg/50">{entry.totalSolved} solved</p>
                      <p className="text-lg font-semibold tabular-nums">
                        {entry.totalPoints}
                        <span className="ml-1 text-xs font-medium text-fg/45">pts</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          )}

          {rest.length > 0 && (
            <ScrollReveal delay={150}>
              <div className="overflow-hidden rounded-lg border border-fg/10">
                <div className="grid grid-cols-[44px_minmax(0,1fr)_72px_72px] items-center gap-x-3 border-b border-fg/10 bg-fg/[0.03] px-4 py-2 text-xs font-medium text-fg/50">
                  <span>Rank</span>
                  <span>Name</span>
                  <span className="text-right">Solved</span>
                  <span className="text-right">Points</span>
                </div>
                {rest.map((entry) => {
                  const isMe = entry.name === user?.name;
                  return (
                    <div
                      key={entry.userId}
                      className={`grid grid-cols-[44px_minmax(0,1fr)_72px_72px] items-center gap-x-3 border-b border-fg/[0.07] px-4 py-3 text-sm last:border-b-0 ${
                        isMe ? "bg-accent/[0.06]" : ""
                      }`}
                    >
                      <span className="font-medium text-fg/50">#{entry.rank}</span>
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate">{entry.name}</span>
                        {isMe && <Tag tone="blue">You</Tag>}
                      </span>
                      <span className="text-right tabular-nums text-fg/60">
                        {entry.totalSolved}
                      </span>
                      <span className="text-right font-semibold tabular-nums">
                        {entry.totalPoints}
                      </span>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          )}
        </>
      )}
    </Page>
  );
};

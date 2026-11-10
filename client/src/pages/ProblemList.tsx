import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Circle, CircleCheck, Search, Star } from "lucide-react";
import { getProblems, getAllTopics } from "../api/problems";
import type { ProblemSummary } from "../api/problems";
import { ScrollReveal } from "../components/ScrollReveal";
import { Page } from "../components/ui/Page";
import { Tag } from "../components/ui/Tag";
import { Callout } from "../components/ui/Callout";
import { difficultyTone, topicTone } from "../components/ui/tones";

const ROW_GRID =
  "grid grid-cols-[22px_minmax(0,1fr)_auto] md:grid-cols-[22px_minmax(0,1fr)_84px_minmax(0,260px)] items-center gap-x-3";

export const ProblemList = () => {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [topic, setTopic] = useState(searchParams.get("topic") || "");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    getAllTopics().then(setTopics).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      getProblems({
        search: search || undefined,
        difficulty: difficulty !== "All" ? difficulty : undefined,
        topic: topic || undefined,
        status: status !== "All" ? status.toLowerCase() : undefined,
      })
        .then(setProblems)
        .catch(() => setError("Failed to load problems"))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, difficulty, topic, status]);

  return (
    <Page
      icon="🧩"
      title="Problems"
      description="Sharpen your skills with curated coding problems."
    >
      <ScrollReveal delay={50}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg/40"
            />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="select"
            aria-label="Difficulty"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="select"
            aria-label="Topic"
          >
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select"
            aria-label="Status"
          >
            <option value="All">All</option>
            <option value="Solved">Solved</option>
            <option value="Unsolved">Unsolved</option>
            <option value="Bookmarked">Bookmarked</option>
          </select>
        </div>
      </ScrollReveal>

      {error && (
        <Callout tone="red" icon="⚠️" role="alert" className="mb-4">
          {error}
        </Callout>
      )}

      <div className="overflow-hidden rounded-lg border border-fg/10">
        {/* Column headers (desktop) */}
        <div
          className={`${ROW_GRID} hidden border-b border-fg/10 bg-fg/[0.03] px-3 py-2 text-xs font-medium text-fg/50 md:grid`}
        >
          <span />
          <span>Name</span>
          <span>Difficulty</span>
          <span>Topics</span>
        </div>

        {loading ? (
          <div className="space-y-px p-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-9" />
            ))}
          </div>
        ) : problems.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-fg/50">
            No problems match your filters.
          </p>
        ) : (
          <div className="animate-fade-in">
            {problems.map((problem) => (
              <Link
                key={problem._id}
                to={`/problems/${problem.slug}`}
                className={`${ROW_GRID} border-b border-fg/[0.07] px-3 py-2.5 transition-colors last:border-b-0 hover:bg-fg/[0.04]`}
              >
                <span className="flex justify-center">
                  {problem.solved ? (
                    <CircleCheck size={17} className="text-[rgb(var(--t-green-fg))]" />
                  ) : (
                    <Circle size={17} className="text-fg/25" />
                  )}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-medium">{problem.title}</span>
                    {problem.bookmarked && (
                      <Star
                        size={13}
                        fill="currentColor"
                        className="shrink-0 text-[rgb(var(--t-yellow-fg))]"
                      />
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1 md:hidden">
                    {problem.topics.map((t) => (
                      <Tag key={t} tone={topicTone(t)}>
                        {t}
                      </Tag>
                    ))}
                  </div>
                </div>

                <span className="flex items-center">
                  <Tag tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Tag>
                </span>

                <div className="hidden flex-wrap gap-1 md:flex">
                  {problem.topics.map((t) => (
                    <Tag key={t} tone={topicTone(t)}>
                      {t}
                    </Tag>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {!loading && problems.length > 0 && (
        <p className="mt-3 text-xs text-fg/40">
          {problems.length} problem{problems.length !== 1 ? "s" : ""}
        </p>
      )}
    </Page>
  );
};

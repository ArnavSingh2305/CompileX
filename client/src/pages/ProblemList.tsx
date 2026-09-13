import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProblems, getAllTopics } from "../api/problems";
import type { ProblemSummary } from "../api/problems";
import { ScrollReveal } from "../components/ScrollReveal";

const difficultyStyle: Record<string, string> = {
  Easy: "text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400",
  Medium: "text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 dark:text-yellow-400",
  Hard: "text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400",
};

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
    <div className="min-h-screen bg-ivory dark:bg-navy-950 p-8">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h1 className="text-3xl font-bold mb-1">Problems</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Sharpen your skills with curated coding problems.</p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[220px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-card focus:outline-none focus:ring-2 focus:ring-accent-purple/40 transition"
              />
            </div>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2.5 rounded-xl glass-card text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/40"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="px-3 py-2.5 rounded-xl glass-card text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/40"
            >
              <option value="">All Topics</option>
              {topics.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2.5 rounded-xl glass-card text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/40"
            >
              <option value="All">All</option>
              <option value="Solved">Solved</option>
              <option value="Unsolved">Unsolved</option>
              <option value="Bookmarked">Bookmarked</option>
            </select>
          </div>
        </ScrollReveal>

        {error && <p className="text-red-500">{error}</p>}

        {loading ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : problems.length === 0 ? (
          <p className="text-slate-400 text-sm">No problems match your filters.</p>
        ) : (
          <div className="space-y-2">
            {problems.map((problem, i) => (
              <ScrollReveal key={problem._id} delay={Math.min(i * 40, 400)}>
                <Link
                  to={`/problems/${problem.slug}`}
                  className="group flex items-center justify-between glass-card rounded-xl p-4 hover:border-accent-purple/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center">
                      {problem.solved ? (
                        <span className="text-green-500 font-bold">✓</span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">○</span>
                      )}
                    </span>
                    <div>
                      <p className="font-medium group-hover:text-accent-purple transition-colors">
                        {problem.title}
                        {problem.bookmarked && <span className="ml-2 text-yellow-500">★</span>}
                      </p>
                      <div className="flex gap-1.5 mt-1">
                        {problem.topics.map((t) => (
                          <span key={t} className="text-[11px] text-slate-400 dark:text-slate-500">
                            {t}{t !== problem.topics[problem.topics.length - 1] && " ·"}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyStyle[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProblems,
  getAllTopics,
} from "../api/problems";
import type { ProblemSummary } from "../api/problems";

const difficultyColor: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

export const ProblemList = () => {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [topic, setTopic] = useState("");
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
    }, 300); // debounce search input

    return () => clearTimeout(timeout);
  }, [search, difficulty, topic, status]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">DSA Problems</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1 min-w-[200px]"
        />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="border rounded px-3 py-2">
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Topics</option>
          {topics.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-3 py-2">
          <option value="All">All</option>
          <option value="Solved">Solved</option>
          <option value="Unsolved">Unsolved</option>
          <option value="Bookmarked">Bookmarked</option>
        </select>
        </div>
      {error && <p className="text-red-600">{error}</p>}
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : problems.length === 0 ? (
        <p className="text-slate-500">No problems match your filters.</p>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {problems.map((problem) => (
            <Link
              key={problem._id}
              to={`/problems/${problem.slug}`}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-2">
                {problem.solved && (
                  <span className="text-green-600 font-bold">&#10003;</span>
                )}

                {problem.bookmarked && (
                  <span className="text-yellow-500">&#9733;</span>
                )}
                <div>
                  <p className="font-medium">{problem.title}</p>
                  <div className="flex gap-2 mt-1">
                    {problem.topics.map((t) => (
                      <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded ${difficultyColor[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
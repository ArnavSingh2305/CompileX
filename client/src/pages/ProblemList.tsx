import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProblems } from "../api/problems";
import type { ProblemSummary } from "../api/problems";

const difficultyColor: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

export const ProblemList = () => {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getProblems();
        setProblems(data);
      } catch (err: any) {
        setError("Failed to load problems");
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (loading) return <div className="p-6">Loading problems...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">DSA Problems</h1>

      <div className="bg-white rounded-lg shadow divide-y">
        {problems.map((problem) => (
          <Link
            key={problem._id}
            to={`/problems/${problem.slug}`}
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-2">
              {problem.solved && <span className="text-green-600 font-bold">✓</span>}
              <div>
                <p className="font-medium">{problem.title}</p>
                <div className="flex gap-2 mt-1">
                  {problem.topics.map((topic) => (
                    <span key={topic} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {topic}
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
    </div>
  );
};
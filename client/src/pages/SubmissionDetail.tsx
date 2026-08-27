import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { getSubmissionById } from "../api/submissions";
import type { SubmissionDetail as SubmissionDetailType } from "../api/submissions";
const statusColor: Record<string, string> = {
  Accepted: "text-green-600 bg-green-50",
  "Wrong Answer": "text-red-600 bg-red-50",
  "Compilation Error": "text-orange-600 bg-orange-50",
  "Runtime Error": "text-orange-600 bg-orange-50",
};

export const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<SubmissionDetailType | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getSubmissionById(id)
      .then(setSubmission)
      .catch((err) => setError(err.response?.data?.message || "Failed to load submission"));
  }, [id]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!submission) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to={`/problems/${submission.problem.slug}`} className="text-blue-600 hover:underline text-sm">
        ← Back to {submission.problem.title}
      </Link>

      <div className="flex items-center justify-between mt-3 mb-6">
        <h1 className="text-2xl font-bold">{submission.problem.title}</h1>
        <span className={`px-3 py-1 rounded font-medium ${statusColor[submission.status] || ""}`}>
          {submission.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div className="bg-white shadow rounded p-3">
          <p className="text-slate-500">Test Cases</p>
          <p className="font-semibold">{submission.passedTestCases} / {submission.totalTestCases}</p>
        </div>
        <div className="bg-white shadow rounded p-3">
          <p className="text-slate-500">Language</p>
          <p className="font-semibold">{submission.language}</p>
        </div>
        <div className="bg-white shadow rounded p-3">
          <p className="text-slate-500">Submitted</p>
          <p className="font-semibold">{new Date(submission.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <h2 className="font-semibold mb-2">Your Code</h2>
      <div className="border rounded overflow-hidden">
        <Editor
          height="400px"
          language={submission.language === "cpp" ? "cpp" : "python"}
          value={submission.code}
          theme="vs-dark"
          options={{ readOnly: true, fontSize: 14, minimap: { enabled: false } }}
        />
      </div>
    </div>
  );
};
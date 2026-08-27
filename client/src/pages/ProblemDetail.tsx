import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

import { getProblemBySlug } from "../api/problems";
import type { ProblemDetail as ProblemDetailType } from "../api/problems";

import {
  submitSolution,
  getSubmissionsByProblem,
} from "../api/submissions";

import type {
  SubmitResult,
  SubmissionHistoryItem,
} from "../api/submissions";

import {
  DEFAULT_CODE,
  LANGUAGE_OPTIONS,
} from "../constants/defaultCode";

const difficultyColor: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

const statusColor: Record<string, string> = {
  Accepted: "text-green-600",
  "Wrong Answer": "text-red-600",
  "Compilation Error": "text-orange-600",
  "Runtime Error": "text-orange-600",
};

export const ProblemDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const [problem, setProblem] =
    useState<ProblemDetailType | null>(null);

  const [language, setLanguage] = useState("cpp");

  const [code, setCode] =
    useState(DEFAULT_CODE["cpp"]);

  const [result, setResult] =
    useState<SubmitResult | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  // Description / Submissions tab
  const [activeTab, setActiveTab] =
    useState<"description" | "submissions">(
      "description"
    );

  // Previous submissions for this problem
  const [problemSubmissions, setProblemSubmissions] =
    useState<SubmissionHistoryItem[]>([]);

  // Load problem
  useEffect(() => {
    if (!slug) return;

    getProblemBySlug(slug)
      .then(setProblem)
      .catch(() =>
        setError("Failed to load problem")
      );
  }, [slug]);

  // Load submissions when Submissions tab is opened
  useEffect(() => {
    if (
      !slug ||
      activeTab !== "submissions"
    ) {
      return;
    }

    getSubmissionsByProblem(slug)
      .then(setProblemSubmissions)
      .catch(() => {});
  }, [slug, activeTab]);

  const handleLanguageChange = (
    newLang: string
  ) => {
    setLanguage(newLang);
    setCode(DEFAULT_CODE[newLang]);
  };

  const handleSubmit = async () => {
    if (!slug) return;

    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const res = await submitSolution(
        slug,
        language,
        code
      );

      setResult(res);

      // Refresh submissions if the
      // Submissions tab is currently open
      if (activeTab === "submissions") {
        getSubmissionsByProblem(slug)
          .then(setProblemSubmissions)
          .catch(() => {});
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Submission failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !problem) {
    return (
      <div className="p-6 text-red-600">
        {error}
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  const currentLangConfig =
    LANGUAGE_OPTIONS.find(
      (l) => l.value === language
    );

  return (
    <div className="grid grid-cols-2 h-[calc(100vh-64px)]">

      {/* ================= LEFT PANEL ================= */}

      <div className="p-6 overflow-y-auto border-r">

        {/* Tabs */}

        <div className="flex gap-4 mb-4 border-b">

          <button
            onClick={() =>
              setActiveTab("description")
            }
            className={`pb-2 px-1 font-medium ${
              activeTab === "description"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-500"
            }`}
          >
            Description
          </button>

          <button
            onClick={() =>
              setActiveTab("submissions")
            }
            className={`pb-2 px-1 font-medium ${
              activeTab === "submissions"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-500"
            }`}
          >
            Submissions
          </button>

        </div>

        {/* ================= DESCRIPTION TAB ================= */}

        {activeTab === "description" ? (
          <>
            <div className="flex items-center gap-3 mb-4">

              <h1 className="text-xl font-bold">
                {problem.title}
              </h1>

              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  difficultyColor[
                    problem.difficulty
                  ]
                }`}
              >
                {problem.difficulty}
              </span>

            </div>

            {/* Topics */}

            <div className="flex gap-2 mb-4">

              {problem.topics.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                >
                  {t}
                </span>
              ))}

            </div>

            {/* Description */}

            <p className="text-slate-700 mb-4 whitespace-pre-wrap">
              {problem.description}
            </p>

            {/* Examples */}

            <h3 className="font-semibold mb-2">
              Examples
            </h3>

            {problem.examples.map(
              (ex, i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded p-3 mb-3 font-mono text-sm"
                >
                  <p>
                    <strong>
                      Input:
                    </strong>{" "}
                    {ex.input}
                  </p>

                  <p>
                    <strong>
                      Output:
                    </strong>{" "}
                    {ex.output}
                  </p>

                  {ex.explanation && (
                    <p className="text-slate-500 mt-1">
                      {ex.explanation}
                    </p>
                  )}
                </div>
              )
            )}

            {/* Constraints */}

            {problem.constraints && (
              <>
                <h3 className="font-semibold mb-2 mt-4">
                  Constraints
                </h3>

                <pre className="bg-slate-50 rounded p-3 text-sm whitespace-pre-wrap">
                  {problem.constraints}
                </pre>
              </>
            )}
          </>
        ) : (

          /* ================= SUBMISSIONS TAB ================= */

          <div>

            <div className="flex items-center justify-between mb-4">

              <div>
                <h1 className="text-xl font-bold">
                  Submissions
                </h1>

                <p className="text-sm text-slate-500">
                  Your previous attempts for{" "}
                  {problem.title}
                </p>
              </div>

            </div>

            {problemSubmissions.length === 0 ? (

              <p className="text-slate-500">
                No submissions yet for this problem.
              </p>

            ) : (

              <div className="divide-y">

                {problemSubmissions.map(
                  (sub) => (

                    <Link
                      key={sub._id}
                      to={`/submissions/${sub._id}`}
                      className="flex justify-between items-center py-3 px-2 hover:bg-slate-50 rounded"
                    >

                      {/* Status */}

                      <span
                        className={`font-medium ${
                          statusColor[
                            sub.status
                          ] || ""
                        }`}
                      >
                        {sub.status}
                      </span>

                      {/* Language + tests */}

                      <span className="text-sm text-slate-500">
                        {sub.language} ·{" "}
                        {sub.passedTestCases}/
                        {sub.totalTestCases}
                      </span>

                      {/* Date */}

                      <span className="text-xs text-slate-400">
                        {new Date(
                          sub.createdAt
                        ).toLocaleDateString()}
                      </span>

                    </Link>

                  )
                )}

              </div>

            )}

          </div>
        )}

      </div>

      {/* ================= RIGHT PANEL ================= */}

      <div className="flex flex-col p-4">

        {/* Language + Submit */}

        <div className="flex justify-between items-center mb-3">

          <select
            value={language}
            onChange={(e) =>
              handleLanguageChange(
                e.target.value
              )
            }
            className="border rounded px-3 py-2"
          >

            {LANGUAGE_OPTIONS.map(
              (opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              )
            )}

          </select>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded disabled:opacity-50"
          >
            {submitting
              ? "Running..."
              : "Submit"}
          </button>

        </div>

        {/* Monaco Editor */}

        <div
          className="border rounded overflow-hidden mb-3"
          style={{ height: "45%" }}
        >

          <Editor
            language={
              currentLangConfig?.monacoLang ||
              "cpp"
            }
            value={code}
            onChange={(v) =>
              setCode(v || "")
            }
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: {
                enabled: false,
              },
              automaticLayout: true,
            }}
          />

        </div>

        {/* ================= RESULT PANEL ================= */}

        <div className="flex-1 overflow-y-auto bg-slate-900 text-slate-100 rounded p-4 font-mono text-sm">

          {error && (
            <p className="text-red-400">
              {error}
            </p>
          )}

          {result && (
            <>

              <p
                className={`font-bold mb-2 ${
                  result.status ===
                  "Accepted"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {result.status} —{" "}
                {result.passedTestCases}/
                {result.totalTestCases} passed
              </p>

              {result.results.map(
                (r, i) => (

                  <div
                    key={i}
                    className="mb-3 border-t border-slate-700 pt-2"
                  >

                    <p
                      className={
                        r.passed
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      Test Case {i + 1}:{" "}
                      {r.passed
                        ? "Passed"
                        : "Failed"}{" "}
                      {r.isHidden &&
                        "(Hidden)"}
                    </p>

                    {!r.isHidden && (
                      <>
                        <p className="text-slate-400">
                          Input:{" "}
                          {r.input}
                        </p>

                        <p className="text-slate-400">
                          Expected:{" "}
                          {r.expectedOutput}
                        </p>

                        <p className="text-slate-400">
                          Got:{" "}
                          {r.actualOutput}
                        </p>
                      </>
                    )}

                  </div>

                )
              )}

            </>
          )}

          {!result && !error && (
            <p className="text-slate-500">
              Click Submit to run against
              test cases
            </p>
          )}

        </div>

      </div>

    </div>
  );
};
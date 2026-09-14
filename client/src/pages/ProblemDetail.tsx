import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useEditorSettings } from "../hooks/useEditorSettings";

import {
  getProblemBySlug,
  toggleBookmark,
  runAgainstPublicTests,
} from "../api/problems";

import type {
  ProblemDetail as ProblemDetailType,
  RunResponse,
} from "../api/problems";

import {
  submitSolution,
  getSubmissionsByProblem,
} from "../api/submissions";

import type {
  SubmitResult,
  SubmissionHistoryItem,
} from "../api/submissions";

import { DEFAULT_CODE, LANGUAGE_OPTIONS } from "../constants/defaultCode";
import { AIPanel } from "../components/AIPanel";

const difficultyStyle: Record<string, string> = {
  Easy: "text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400",
  Medium: "text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 dark:text-yellow-400",
  Hard: "text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400",
};

const statusColor: Record<string, string> = {
  Accepted: "text-green-600 dark:text-green-400",
  "Wrong Answer": "text-red-600 dark:text-red-400",
  "Compilation Error": "text-orange-600 dark:text-orange-400",
  "Runtime Error": "text-orange-600 dark:text-orange-400",
};

export const ProblemDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const [problem, setProblem] = useState<ProblemDetailType | null>(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(DEFAULT_CODE["cpp"]);
  const [stdin, setStdin] = useState("");

  const [result, setResult] = useState<SubmitResult | null>(null);
  const [runResult, setRunResult] = useState<RunResponse | null>(null);
  const [lastAction, setLastAction] = useState<"run" | "submit" | null>(null);
  const [lastErrorOutput, setLastErrorOutput] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const [leftTab, setLeftTab] = useState<"description" | "submissions">("description");
  const [rightTab, setRightTab] = useState<"input" | "output" | "testcases">("output");

  const [problemSubmissions, setProblemSubmissions] = useState<SubmissionHistoryItem[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const editorSettings = useEditorSettings();
  useEffect(() => {
    if (!slug) return;
    getProblemBySlug(slug)
      .then((data) => {
        setProblem(data);
        setBookmarked(data.bookmarked);
      })
      .catch(() => setError("Failed to load problem"));
  }, [slug]);

  useEffect(() => {
    if (!slug || leftTab !== "submissions") return;
    getSubmissionsByProblem(slug).then(setProblemSubmissions).catch(() => {});
  }, [slug, leftTab]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(DEFAULT_CODE[newLang]);
  };

  const handleToggleBookmark = async () => {
    if (!slug) return;
    try {
      const res = await toggleBookmark(slug);
      setBookmarked(res.bookmarked);
    } catch {
      // non-critical, fail silently
    }
  };

  const handleRun = async () => {
    if (!slug) return;
    setRunning(true);
    setError("");
    setRunResult(null);
    setLastAction("run");
    setRightTab("output");
    try {
      const res = await runAgainstPublicTests(slug, language, code);
      setRunResult(res);
      if (res.compileError) setLastErrorOutput(res.compileError);
    } catch (err: any) {
      setError(err.response?.data?.message || "Run failed");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!slug) return;
    setSubmitting(true);
    setError("");
    setResult(null);
    setLastAction("submit");
    setRightTab("output");
    try {
      const res = await submitSolution(slug, language, code);
      setResult(res);
      if (res.status !== "Accepted") {
        const failedCase = res.results.find((r) => !r.passed);
        setLastErrorOutput(failedCase?.actualOutput || "");
      }
      if (leftTab === "submissions") {
        getSubmissionsByProblem(slug).then(setProblemSubmissions);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !problem) return <div className="p-6 text-red-500">{error}</div>;
  if (!problem) return <div className="p-6 text-slate-400">Loading...</div>;

  const currentLangConfig = LANGUAGE_OPTIONS.find((l) => l.value === language);

  return (
    <div className="grid md:grid-cols-2 h-[calc(100vh-0px)] bg-ivory dark:bg-navy-950">
      {/* LEFT: Problem info */}
      <div className="overflow-y-auto border-r border-slate-200/60 dark:border-white/5 p-6">
        <div className="flex gap-4 mb-4 border-b border-slate-200/60 dark:border-white/5">
          {(["description", "submissions"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setLeftTab(tab)}
              className={`pb-2 px-1 text-sm font-medium capitalize transition ${
                leftTab === tab
                  ? "border-b-2 border-accent-purple text-accent-purple"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {leftTab === "description" ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-xl font-bold">{problem.title}</h1>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyStyle[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <button
                onClick={handleToggleBookmark}
                className="ml-auto text-2xl hover:scale-110 transition-transform"
                title={bookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {bookmarked ? "★" : "☆"}
              </button>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {problem.topics.map((t) => (
                <span key={t} className="text-xs bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>

            <p className="text-slate-700 dark:text-slate-300 mb-5 whitespace-pre-wrap leading-relaxed">{problem.description}</p>

            <h3 className="font-semibold mb-2 text-sm">Examples</h3>
            {problem.examples.map((ex, i) => (
              <div key={i} className="glass-card rounded-xl p-3 mb-3 font-mono text-xs">
                <p><span className="text-slate-400">Input:</span> {ex.input}</p>
                <p><span className="text-slate-400">Output:</span> {ex.output}</p>
                {ex.explanation && <p className="text-slate-400 mt-1">{ex.explanation}</p>}
              </div>
            ))}

            {problem.constraints && (
              <>
                <h3 className="font-semibold mb-2 mt-4 text-sm">Constraints</h3>
                <pre className="glass-card rounded-xl p-3 text-xs whitespace-pre-wrap font-mono">{problem.constraints}</pre>
              </>
            )}

            {problem.relatedArticles.length > 0 && (
              <div className="mt-5 bg-accent-blue/5 border border-accent-blue/20 rounded-xl p-3">
                <p className="text-xs font-medium text-accent-blue mb-1">📖 Related Learning</p>
                {problem.relatedArticles.map((a) => (
                  <Link key={a._id} to={`/learn/${a.slug}`} className="text-accent-purple hover:underline text-sm block">
                    {a.title}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-5">
              <AIPanel slug={slug!} code={code} language={language} lastErrorOutput={lastErrorOutput} />
            </div>
          </>
        ) : (
          <div>
            {problemSubmissions.length === 0 ? (
              <p className="text-slate-400 text-sm">No submissions yet for this problem.</p>
            ) : (
              <div className="space-y-2">
                {problemSubmissions.map((sub) => (
                  <Link
                    key={sub._id}
                    to={`/submissions/${sub._id}`}
                    className="flex justify-between items-center glass-card rounded-xl p-3 hover:border-accent-purple/40 transition"
                  >
                    <span className={`text-sm font-medium ${statusColor[sub.status] || ""}`}>{sub.status}</span>
                    <span className="text-xs text-slate-400">{sub.language} · {sub.passedTestCases}/{sub.totalTestCases}</span>
                    <span className="text-xs text-slate-400">{new Date(sub.createdAt).toLocaleDateString()}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: Editor + tabbed output */}
      <div className="flex flex-col p-4 min-h-0">
        <div className="flex justify-between items-center mb-3">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="glass-card rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleRun}
              disabled={running || submitting}
              className="px-4 py-2 rounded-lg glass-card font-medium text-sm hover:border-accent-purple/40 disabled:opacity-50 transition"
            >
              {running ? "Running..." : "▶ Run"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || running}
              className="px-5 py-2 rounded-lg bg-gradient-brand text-white font-medium text-sm hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-transform"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-200/60 dark:border-white/5 mb-3" style={{ height: "50%" }}>
          <Editor
            language={currentLangConfig?.monacoLang || "cpp"}
            value={code}
            onChange={(v) => setCode(v || "")}
            theme="vs-dark"
            options={{
              fontSize: editorSettings.fontSize,
              tabSize: editorSettings.tabSize,
              wordWrap: editorSettings.wordWrap ? "on" : "off",
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        </div>

        {/* Bottom tabbed panel */}
        <div className="flex-1 glass-card rounded-xl flex flex-col min-h-0">
          <div className="flex gap-1 p-2 border-b border-slate-200/60 dark:border-white/5">
            {(["input", "output", "testcases"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                  rightTab === tab
                    ? "bg-gradient-brand text-white"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                {tab === "testcases" ? "Test Cases" : tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
            {rightTab === "input" && (
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter custom input for Run..."
                className="w-full h-full bg-transparent resize-none focus:outline-none placeholder:text-slate-400"
              />
            )}

            {rightTab === "testcases" && (
              <div className="space-y-3">
                {problem.testCases.map((tc, i) => (
                  <div key={i} className="glass-card rounded-lg p-3">
                    <p className="text-slate-400 mb-1">Test Case {i + 1}</p>
                    <p><span className="text-slate-400">Input:</span> {tc.input}</p>
                    <p><span className="text-slate-400">Expected:</span> {tc.expectedOutput}</p>
                  </div>
                ))}
              </div>
            )}

            {rightTab === "output" && (
              <div className="text-slate-800 dark:text-slate-200">
                {error && <p className="text-red-500">{error}</p>}

                {lastAction === "run" && runResult && (
                  <>
                    {runResult.compileError ? (
                      <p className="text-red-500 whitespace-pre-wrap">Compilation Error{"\n"}{runResult.compileError}</p>
                    ) : (
                      <>
                        <p className="text-slate-400 mb-2">Run against public test cases — not saved to history</p>
                        {runResult.results.map((r, i) => (
                          <div key={i} className="mb-3 pb-3 border-b border-slate-200/60 dark:border-white/5 last:border-0">
                            <p className={r.passed ? "text-green-500" : "text-red-500"}>
                              Test Case {i + 1}: {r.passed ? "Passed ✓" : "Failed ✗"}
                            </p>
                            <p className="text-slate-400">Input: {r.input}</p>
                            <p className="text-slate-400">Expected: {r.expectedOutput}</p>
                            <p className="text-slate-400">Got: {r.actualOutput}</p>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}

                {lastAction === "submit" && result && (
                  <>
                    <p className={`font-bold mb-3 ${result.status === "Accepted" ? "text-green-500" : "text-red-500"}`}>
                      {result.status} — {result.passedTestCases}/{result.totalTestCases} passed
                    </p>
                    {result.results.map((r, i) => (
                      <div key={i} className="mb-3 pb-3 border-b border-slate-200/60 dark:border-white/5 last:border-0">
                        <p className={r.passed ? "text-green-500" : "text-red-500"}>
                          Test Case {i + 1}: {r.passed ? "Passed ✓" : "Failed ✗"} {r.isHidden && "(Hidden)"}
                        </p>
                        {!r.isHidden && (
                          <>
                            <p className="text-slate-400">Input: {r.input}</p>
                            <p className="text-slate-400">Expected: {r.expectedOutput}</p>
                            <p className="text-slate-400">Got: {r.actualOutput}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}

                {!lastAction && !error && (
                  <p className="text-slate-400">Click Run to test, or Submit to record your solution.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
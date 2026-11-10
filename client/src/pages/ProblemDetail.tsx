import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Play, Star } from "lucide-react";
import { useEditorSettings } from "../hooks/useEditorSettings";
import { useTheme } from "../context/ThemeContext";
import { defineEditorThemes, editorThemeName } from "../lib/monacoThemes";

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
import { Tag } from "../components/ui/Tag";
import { Callout } from "../components/ui/Callout";
import { Spinner } from "../components/ui/Spinner";
import { difficultyTone, statusTone, topicTone } from "../components/ui/tones";

interface CaseRowProps {
  index: number;
  passed: boolean;
  hidden?: boolean;
  input: string;
  expected: string;
  actual: string;
}

const CaseRow = ({ index, passed, hidden, input, expected, actual }: CaseRowProps) => (
  <div className="border-b border-fg/[0.07] py-3 first:pt-0 last:border-0 last:pb-0">
    <div className="flex items-center gap-2">
      <span className="font-sans text-[13px] font-medium">Test case {index + 1}</span>
      <Tag tone={passed ? "green" : "red"}>{passed ? "Passed" : "Failed"}</Tag>
      {hidden && <Tag>Hidden</Tag>}
    </div>
    {!hidden && (
      <dl className="mt-2 grid grid-cols-[64px_minmax(0,1fr)] gap-y-1 text-fg/75">
        <dt className="text-fg/40">Input</dt>
        <dd className="whitespace-pre-wrap break-all">{input}</dd>
        <dt className="text-fg/40">Expected</dt>
        <dd className="whitespace-pre-wrap break-all">{expected}</dd>
        <dt className="text-fg/40">Got</dt>
        <dd className="whitespace-pre-wrap break-all">{actual}</dd>
      </dl>
    )}
  </div>
);

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
  const { resolvedTheme } = useTheme();

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

  if (error && !problem) {
    return (
      <div className="w-full p-6">
        <Callout tone="red" icon="⚠️" role="alert">
          {error}
        </Callout>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="w-full space-y-3 p-8">
        <div className="skeleton h-9 w-1/3" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-40 w-full" />
      </div>
    );
  }

  const currentLangConfig = LANGUAGE_OPTIONS.find((l) => l.value === language);

  return (
    <div className="grid w-full md:h-screen md:grid-cols-2">
      {/* ---------------- LEFT: problem ---------------- */}
      <div className="min-h-0 p-5 md:overflow-y-auto md:border-r md:border-fg/[0.08] md:p-8">
        <div className="mb-6 flex gap-5 border-b border-fg/10">
          {(["description", "submissions"] as const).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setLeftTab(tab)}
              className={`view-tab capitalize ${leftTab === tab ? "view-tab-active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {leftTab === "description" ? (
          <>
            <div className="mb-4 flex items-start gap-3">
              <h1 className="flex-1 text-[28px] font-bold leading-tight tracking-tight">
                {problem.title}
              </h1>
              <button
                type="button"
                onClick={handleToggleBookmark}
                aria-pressed={bookmarked}
                title={bookmarked ? "Remove bookmark" : "Add bookmark"}
                className="mt-1 rounded-md p-1.5 text-fg/40 transition-colors hover:bg-fg/5 hover:text-fg"
              >
                <Star
                  size={20}
                  fill={bookmarked ? "currentColor" : "none"}
                  className={bookmarked ? "text-[rgb(var(--t-yellow-fg))]" : ""}
                />
              </button>
            </div>

            <dl className="mb-6 grid grid-cols-[84px_minmax(0,1fr)] items-center gap-y-2 text-sm">
              <dt className="text-fg/50">Difficulty</dt>
              <dd>
                <Tag tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Tag>
              </dd>
              <dt className="text-fg/50">Topics</dt>
              <dd className="flex flex-wrap gap-1">
                {problem.topics.map((t) => (
                  <Tag key={t} tone={topicTone(t)}>
                    {t}
                  </Tag>
                ))}
              </dd>
            </dl>

            <p className="mb-7 whitespace-pre-wrap text-[15px] leading-7">{problem.description}</p>

            <h3 className="mb-2 text-base font-semibold">Examples</h3>
            {problem.examples.map((ex, i) => (
              <div
                key={i}
                className="mb-3 rounded-md bg-code p-3 font-mono text-[13px] leading-6"
              >
                <p>
                  <span className="text-fg/45">Input: </span>
                  {ex.input}
                </p>
                <p>
                  <span className="text-fg/45">Output: </span>
                  {ex.output}
                </p>
                {ex.explanation && <p className="mt-1 text-fg/55">{ex.explanation}</p>}
              </div>
            ))}

            {problem.constraints && (
              <>
                <h3 className="mb-2 mt-6 text-base font-semibold">Constraints</h3>
                <pre className="whitespace-pre-wrap rounded-md bg-code p-3 font-mono text-[13px] leading-6">
                  {problem.constraints}
                </pre>
              </>
            )}

            {problem.relatedArticles.length > 0 && (
              <Callout tone="blue" icon="📖" className="mt-6">
                <p className="mb-1 font-medium">Related learning</p>
                {problem.relatedArticles.map((a) => (
                  <Link
                    key={a._id}
                    to={`/learn/${a.slug}`}
                    className="block text-link hover:underline"
                  >
                    {a.title}
                  </Link>
                ))}
              </Callout>
            )}

            <div className="mt-6">
              <AIPanel
                slug={slug!}
                code={code}
                language={language}
                lastErrorOutput={lastErrorOutput}
              />
            </div>
          </>
        ) : (
          <div>
            {problemSubmissions.length === 0 ? (
              <p className="text-sm text-fg/50">No submissions yet for this problem.</p>
            ) : (
              <div className="card divide-y divide-fg/[0.07] overflow-hidden">
                {problemSubmissions.map((sub) => (
                  <Link
                    key={sub._id}
                    to={`/submissions/${sub._id}`}
                    className="card-hover flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <Tag tone={statusTone(sub.status)}>{sub.status}</Tag>
                    <span className="text-xs text-fg/50">
                      {sub.language} · {sub.passedTestCases}/{sub.totalTestCases}
                    </span>
                    <span className="text-xs text-fg/40">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---------------- RIGHT: editor + output ---------------- */}
      <div className="flex min-h-0 flex-col gap-3 border-t border-fg/10 p-4 md:overflow-hidden md:border-t-0">
        <div className="flex items-center justify-between gap-2">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="select"
            aria-label="Language"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRun}
              disabled={running || submitting}
              className="btn btn-secondary"
            >
              {running ? (
                <>
                  <Spinner className="h-3.5 w-3.5" />
                  Running...
                </>
              ) : (
                <>
                  <Play size={12} fill="currentColor" />
                  Run
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || running}
              className="btn btn-primary"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        <div className="h-[340px] shrink-0 overflow-hidden rounded-lg border border-fg/10 md:h-1/2">
          <Editor
            language={currentLangConfig?.monacoLang || "cpp"}
            value={code}
            onChange={(v) => setCode(v || "")}
            theme={editorThemeName(resolvedTheme)}
            beforeMount={defineEditorThemes}
            options={{
              fontSize: editorSettings.fontSize,
              tabSize: editorSettings.tabSize,
              wordWrap: editorSettings.wordWrap ? "on" : "off",
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 12 },
            }}
          />
        </div>

        {/* Bottom tabbed panel */}
        <div className="flex min-h-[260px] flex-1 flex-col overflow-hidden rounded-lg border border-fg/10 md:min-h-0">
          <div className="flex gap-1 border-b border-fg/10 p-1.5">
            {(["input", "output", "testcases"] as const).map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setRightTab(tab)}
                className={`chip !py-1 text-xs ${rightTab === tab ? "chip-active" : ""}`}
              >
                {tab === "testcases" ? "Test Cases" : tab === "input" ? "Input" : "Output"}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-5">
            {rightTab === "input" && (
              <div className="flex h-full flex-col gap-2">
                <p className="font-sans text-[11px] text-fg/45">
                  Custom input isn't used by Run yet — Run executes the public test cases.
                </p>
                <textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="Enter custom input..."
                  className="min-h-[80px] w-full flex-1 resize-none bg-transparent placeholder:text-fg/35 focus:outline-none"
                />
              </div>
            )}

            {rightTab === "testcases" && (
              <div>
                {problem.testCases.map((tc, i) => (
                  <div
                    key={i}
                    className="border-b border-fg/[0.07] py-3 first:pt-0 last:border-0 last:pb-0"
                  >
                    <p className="mb-1.5 font-sans text-[13px] font-medium">Test case {i + 1}</p>
                    <dl className="grid grid-cols-[64px_minmax(0,1fr)] gap-y-1 text-fg/75">
                      <dt className="text-fg/40">Input</dt>
                      <dd className="whitespace-pre-wrap break-all">{tc.input}</dd>
                      <dt className="text-fg/40">Expected</dt>
                      <dd className="whitespace-pre-wrap break-all">{tc.expectedOutput}</dd>
                    </dl>
                  </div>
                ))}
              </div>
            )}

            {rightTab === "output" && (
              <div>
                {error && (
                  <Callout tone="red" icon="⚠️" role="alert" className="font-sans">
                    {error}
                  </Callout>
                )}

                {lastAction === "run" && runResult && (
                  <>
                    {runResult.compileError ? (
                      <pre className="whitespace-pre-wrap text-[rgb(var(--t-red-fg))]">
                        Compilation Error{"\n"}
                        {runResult.compileError}
                      </pre>
                    ) : (
                      <>
                        <p className="mb-3 font-sans text-[11px] text-fg/45">
                          Run against public test cases — not saved to history
                        </p>
                        {runResult.results.map((r, i) => (
                          <CaseRow
                            key={i}
                            index={i}
                            passed={r.passed}
                            input={r.input}
                            expected={r.expectedOutput}
                            actual={r.actualOutput}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}

                {lastAction === "submit" && result && (
                  <>
                    <div className="mb-3 flex items-center gap-2 font-sans">
                      <Tag tone={statusTone(result.status)} className="!text-[13px]">
                        {result.status}
                      </Tag>
                      <span className="text-[13px] text-fg/60">
                        {result.passedTestCases}/{result.totalTestCases} passed
                      </span>
                    </div>
                    {result.results.map((r, i) => (
                      <CaseRow
                        key={i}
                        index={i}
                        passed={r.passed}
                        hidden={r.isHidden}
                        input={r.input}
                        expected={r.expectedOutput}
                        actual={r.actualOutput}
                      />
                    ))}
                  </>
                )}

                {!lastAction && !error && (
                  <p className="font-sans text-fg/50">
                    Click Run to test, or Submit to record your solution.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

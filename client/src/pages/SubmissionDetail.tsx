import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { ArrowLeft } from "lucide-react";
import { getSubmissionById } from "../api/submissions";
import type { SubmissionDetail as SubmissionDetailType } from "../api/submissions";
import { useTheme } from "../context/ThemeContext";
import { defineEditorThemes, editorThemeName } from "../lib/monacoThemes";
import { Tag } from "../components/ui/Tag";
import { Callout } from "../components/ui/Callout";
import { statusTone } from "../components/ui/tones";

export const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { resolvedTheme } = useTheme();
  const [submission, setSubmission] = useState<SubmissionDetailType | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getSubmissionById(id)
      .then(setSubmission)
      .catch((err) => setError(err.response?.data?.message || "Failed to load submission"));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-16 md:px-12">
        <Callout tone="red" icon="⚠️" role="alert">
          {error}
        </Callout>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-3 px-5 py-16 md:px-12">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-10 w-1/2" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10 md:px-12 md:pt-16">
        <Link
          to={`/problems/${submission.problem.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-fg/55 transition-colors hover:text-fg"
        >
          <ArrowLeft size={14} />
          Back to {submission.problem.title}
        </Link>

        <div className="mb-6 mt-5 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{submission.problem.title}</h1>
          <Tag tone={statusTone(submission.status)} className="!text-[13px]">
            {submission.status}
          </Tag>
        </div>

        <dl className="mb-8 grid grid-cols-[110px_minmax(0,1fr)] gap-y-2.5 text-sm">
          <dt className="text-fg/50">Test cases</dt>
          <dd className="font-medium">
            {submission.passedTestCases} / {submission.totalTestCases}
          </dd>
          <dt className="text-fg/50">Language</dt>
          <dd className="font-medium">{submission.language}</dd>
          <dt className="text-fg/50">Submitted</dt>
          <dd className="font-medium">{new Date(submission.createdAt).toLocaleString()}</dd>
        </dl>

        <h2 className="mb-2 text-base font-semibold">Your code</h2>
        <div className="overflow-hidden rounded-lg border border-fg/10">
          <Editor
            height="400px"
            language={submission.language === "cpp" ? "cpp" : "python"}
            value={submission.code}
            theme={editorThemeName(resolvedTheme)}
            beforeMount={defineEditorThemes}
            options={{
              readOnly: true,
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 12 },
            }}
          />
        </div>
      </div>
    </div>
  );
};

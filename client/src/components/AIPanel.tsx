import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { explainConcept, getHint, debugCode, explainComplexity } from "../api/ai";

interface AIPanelProps {
  slug: string;
  code: string;
  language: string;
  lastErrorOutput?: string;
}

export const AIPanel = ({ slug, code, language, lastErrorOutput }: AIPanelProps) => {
  const [mode, setMode] = useState<"explain" | "hint" | "debug" | "complexity" | null>(null);
  const [reply, setReply] = useState("");
  const [hintLevel, setHintLevel] = useState(1);
  const [loading, setLoading] = useState(false);

  const run = async (fn: () => Promise<string>, newMode: typeof mode) => {
    setMode(newMode);
    setLoading(true);
    setReply("");
    try {
      const result = await fn();
      setReply(result);
    } catch (err: any) {
      setReply("AI request failed: " + (err.response?.data?.message || "unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-3">
      <p className="font-medium text-sm mb-2">
        🤖 AI Mentor
      </p>

      <div className="flex gap-2 flex-wrap mb-3">
        <button
          onClick={() =>
            run(() => explainConcept(slug), "explain")
          }
          className="text-xs bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition"
        >
          Explain Concept
        </button>

        <button
          onClick={() =>
            run(
              () => getHint(slug, hintLevel, code),
              "hint"
            )
          }
          className="text-xs bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition"
        >
          Hint (Level {hintLevel})
        </button>

        <button
          onClick={() =>
            run(
              () =>
                debugCode(
                  slug,
                  code,
                  language,
                  lastErrorOutput || "No error output yet"
                ),
              "debug"
            )
          }
          className="text-xs bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition"
        >
          Debug My Code
        </button>

        <button
          onClick={() =>
            run(
              () => explainComplexity(code, language),
              "complexity"
            )
          }
          className="text-xs bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition"
        >
          Analyze Complexity
        </button>
      </div>

      {mode === "hint" && (
        <div className="flex gap-1 mb-2">
          {[1, 2, 3, 4].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setHintLevel(lvl)}
              className={`text-xs w-7 h-7 rounded-lg transition ${
                hintLevel === lvl
                  ? "bg-gradient-brand text-white"
                  : "bg-slate-100 dark:bg-white/5"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <p className="text-sm text-slate-400">
          Thinking...
        </p>
      )}

      {reply && (
        <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {reply}
          </ReactMarkdown>
        </div>
      )}

      {!mode && (
        <p className="text-sm text-slate-400">
          Pick a mode above to get AI assistance.
        </p>
      )}
    </div>
  );
};
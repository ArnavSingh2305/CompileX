import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { BookOpen, Bug, Gauge, Lightbulb, Sparkles } from "lucide-react";
import "katex/dist/katex.min.css";
import { explainConcept, getHint, debugCode, explainComplexity } from "../api/ai";
import { Spinner } from "./ui/Spinner";

interface AIPanelProps {
  slug: string;
  code: string;
  language: string;
  lastErrorOutput?: string;
}

const modeButton =
  "btn btn-secondary h-7 gap-1.5 px-2.5 text-xs [&_svg]:text-fg/50";

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
    <div className="rounded-lg border border-fg/10 p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Sparkles size={16} className="text-[rgb(var(--t-purple-fg))]" />
        AI Mentor
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => run(() => explainConcept(slug), "explain")}
          disabled={loading}
          className={modeButton}
        >
          <BookOpen size={13} />
          Explain Concept
        </button>

        <button
          type="button"
          onClick={() => run(() => getHint(slug, hintLevel, code), "hint")}
          disabled={loading}
          className={modeButton}
        >
          <Lightbulb size={13} />
          Hint (Level {hintLevel})
        </button>

        <button
          type="button"
          onClick={() =>
            run(
              () => debugCode(slug, code, language, lastErrorOutput || "No error output yet"),
              "debug"
            )
          }
          disabled={loading}
          className={modeButton}
        >
          <Bug size={13} />
          Debug My Code
        </button>

        <button
          type="button"
          onClick={() => run(() => explainComplexity(code, language), "complexity")}
          disabled={loading}
          className={modeButton}
        >
          <Gauge size={13} />
          Analyze Complexity
        </button>
      </div>

      {mode === "hint" && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs text-fg/50">Hint level</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((lvl) => (
              <button
                type="button"
                key={lvl}
                onClick={() => setHintLevel(lvl)}
                className={`h-7 w-7 rounded-md text-xs font-medium transition-colors ${
                  hintLevel === lvl
                    ? "bg-fg text-bg"
                    : "bg-fg/[0.06] text-fg/70 hover:bg-fg/10"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <p className="flex items-center gap-2 text-sm text-fg/50">
          <Spinner className="h-3.5 w-3.5" />
          Thinking...
        </p>
      )}

      {reply && (
        <div className="prose prose-sm prose-notion max-w-none leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {reply}
          </ReactMarkdown>
        </div>
      )}

      {!mode && (
        <p className="text-sm text-fg/50">Pick a mode above to get AI assistance.</p>
      )}
    </div>
  );
};

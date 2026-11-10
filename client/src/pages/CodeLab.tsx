import { useState } from "react";
import { useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Play } from "lucide-react";
import { runCode } from "../api/compiler";
import type { RunResult } from "../api/compiler";
import { DEFAULT_CODE, LANGUAGE_OPTIONS } from "../constants/defaultCode";
import { ScrollReveal } from "../components/ScrollReveal";
import { useEditorSettings } from "../hooks/useEditorSettings";
import { useTheme } from "../context/ThemeContext";
import { defineEditorThemes, editorThemeName } from "../lib/monacoThemes";
import { Page } from "../components/ui/Page";
import { Spinner } from "../components/ui/Spinner";

export const CodeLab = () => {
  const location = useLocation();
  const prefill = location.state as { prefillCode?: string; prefillLanguage?: string } | null;
  const editorSettings = useEditorSettings();
  const { resolvedTheme } = useTheme();
  const [language, setLanguage] = useState(prefill?.prefillLanguage || "cpp");
  const [code, setCode] = useState(
    prefill?.prefillCode || DEFAULT_CODE[prefill?.prefillLanguage || "cpp"]
  );
  const [stdin, setStdin] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(DEFAULT_CODE[newLang]);
    setResult(null);
  };

  const handleClear = () => {
    setCode(DEFAULT_CODE[language]);
    setStdin("");
    setResult(null);
    setError("");
  };

  const handleRun = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await runCode(language, code, stdin);
      setResult(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Execution failed");
    } finally {
      setLoading(false);
    }
  };

  const currentLangConfig = LANGUAGE_OPTIONS.find((l) => l.value === language);

  return (
    <Page
      icon="💻"
      title="Code Lab"
      description="Write, run and test code in real time."
    >
      <ScrollReveal delay={50}>
        <div className="mb-4 overflow-hidden rounded-lg border border-fg/10">
          <div className="flex items-center justify-between border-b border-fg/10 bg-fg/[0.03] px-3 py-2">
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
              <button type="button" onClick={handleClear} className="btn btn-ghost">
                Clear
              </button>
              <button
                type="button"
                onClick={handleRun}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <Spinner className="h-3.5 w-3.5" />
                    Running
                  </>
                ) : (
                  <>
                    <Play size={12} fill="currentColor" />
                    Run
                  </>
                )}
              </button>
            </div>
          </div>

          <Editor
            height="420px"
            language={currentLangConfig?.monacoLang || "cpp"}
            value={code}
            onChange={(value) => setCode(value || "")}
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
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg border border-fg/10">
            <p className="border-b border-fg/10 bg-fg/[0.03] px-3 py-2 text-xs font-medium text-fg/55">
              Input (stdin)
            </p>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              className="block h-36 w-full resize-none bg-transparent p-3 font-mono text-[13px] placeholder:text-fg/35 focus:outline-none"
              placeholder="Enter input here if your program needs it"
            />
          </div>

          <div className="overflow-hidden rounded-lg border border-fg/10">
            <p className="border-b border-fg/10 bg-fg/[0.03] px-3 py-2 text-xs font-medium text-fg/55">
              Output
            </p>
            <div className="h-36 overflow-y-auto p-3 font-mono text-[13px] leading-5">
              {error && <span className="text-[rgb(var(--t-red-fg))]">{error}</span>}

              {result?.compileError && (
                <span className="whitespace-pre-wrap text-[rgb(var(--t-red-fg))]">
                  Compilation Error{"\n"}
                  {result.compileError}
                </span>
              )}

              {result && !result.compileError && (
                <>
                  {result.stdout && (
                    <span className="whitespace-pre-wrap">{result.stdout}</span>
                  )}
                  {result.stderr && (
                    <span className="whitespace-pre-wrap text-[rgb(var(--t-orange-fg))]">
                      {"\n"}
                      {result.stderr}
                    </span>
                  )}
                  {!result.stdout && !result.stderr && (
                    <span className="text-fg/45">Program ran with no output</span>
                  )}
                </>
              )}

              {!result && !error && !loading && (
                <span className="text-fg/45">Click Run to see output</span>
              )}

              {loading && <span className="text-fg/45">Running your code...</span>}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </Page>
  );
};

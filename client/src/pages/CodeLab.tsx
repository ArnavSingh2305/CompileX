import { useState } from "react";
import { useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { runCode } from "../api/compiler";
import type { RunResult } from "../api/compiler";
import { DEFAULT_CODE, LANGUAGE_OPTIONS } from "../constants/defaultCode";
import { ScrollReveal } from "../components/ScrollReveal";

export const CodeLab = () => {
  const location = useLocation();
  const prefill = location.state as { prefillCode?: string; prefillLanguage?: string } | null;

  const [language, setLanguage] = useState(prefill?.prefillLanguage || "cpp");
  const [code, setCode] = useState(prefill?.prefillCode || DEFAULT_CODE[prefill?.prefillLanguage || "cpp"]);
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
    <div className="min-h-screen bg-ivory dark:bg-navy-950 p-8">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h1 className="text-3xl font-bold mb-1">Code Lab</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Write, run and test code in real time.</p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="glass-card rounded-2xl overflow-hidden mb-4">
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200/60 dark:border-white/5">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-sm font-medium text-navy-900 dark:text-white focus:outline-none"
              >
               {LANGUAGE_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-white text-navy-900 dark:bg-navy-900 dark:text-white"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                >
                  Clear
                </button>
                <button
                  onClick={handleRun}
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg bg-gradient-brand text-white text-xs font-medium hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-transform flex items-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Running
                    </>
                  ) : (
                    <>▶ Run</>
                  )}
                </button>
              </div>
            </div>
            <Editor
              height="420px"
              language={currentLangConfig?.monacoLang || "cpp"}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl overflow-hidden">
              <p className="text-xs font-medium text-slate-500 px-4 py-2 border-b border-slate-200/60 dark:border-white/5">Input</p>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                className="w-full h-32 p-4 bg-transparent font-mono text-sm resize-none focus:outline-none placeholder:text-slate-400"
                placeholder="Enter input here if your program needs it"
              />
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
              <p className="text-xs font-medium text-slate-500 px-4 py-2 border-b border-slate-200/60 dark:border-white/5">Output</p>
              <div className="h-32 p-4 font-mono text-sm overflow-y-auto">
                {error && <span className="text-red-500">{error}</span>}

                {result?.compileError && (
                  <span className="text-red-500 whitespace-pre-wrap">
                    Compilation Error{"\n"}{result.compileError}
                  </span>
                )}

                {result && !result.compileError && (
                  <>
                    {result.stdout && <span className="text-green-500 whitespace-pre-wrap">{result.stdout}</span>}
                    {result.stderr && (
                      <span className="text-yellow-500 whitespace-pre-wrap">{"\n"}{result.stderr}</span>
                    )}
                    {!result.stdout && !result.stderr && (
                      <span className="text-slate-400">Program ran with no output</span>
                    )}
                  </>
                )}

                {!result && !error && !loading && (
                  <span className="text-slate-400">Click Run to see output</span>
                )}

                {loading && <span className="text-slate-400">Running your code...</span>}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
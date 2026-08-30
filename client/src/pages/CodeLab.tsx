import { useState } from "react";
import Editor from "@monaco-editor/react";
import { runCode } from "../api/compiler";
import type { RunResult } from "../api/compiler";
import { DEFAULT_CODE, LANGUAGE_OPTIONS } from "../constants/defaultCode";
import { useLocation } from "react-router-dom";

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Code Lab</h1>
        <div className="flex gap-3 items-center">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleRun}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded overflow-hidden">
          <Editor
            height="500px"
            language={currentLangConfig?.monacoLang || "cpp"}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Input (stdin)</label>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              className="w-full border rounded p-2 h-24 font-mono text-sm"
              placeholder="Enter input here if your program needs it"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Output</label>
            <div className="bg-slate-900 text-slate-100 rounded p-4 h-64 overflow-auto font-mono text-sm whitespace-pre-wrap">
              {error && <span className="text-red-400">{error}</span>}

              {result?.compileError && (
                <span className="text-red-400">
                  Compilation Error{"\n"}
                  {result.compileError}
                </span>
              )}

              {result && !result.compileError && (
                <>
                  {result.stdout && <span className="text-green-400">{result.stdout}</span>}
                  {result.stderr && (
                    <span className="text-yellow-400">
                      {"\n"}{result.stderr}
                    </span>
                  )}
                  {!result.stdout && !result.stderr && (
                    <span className="text-slate-500">Program ran with no output</span>
                  )}
                </>
              )}

              {!result && !error && !loading && (
                <span className="text-slate-500">Click Run to see output</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
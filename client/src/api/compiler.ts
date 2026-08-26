import api from "./axios";

export interface RunResult {
  stdout: string;
  stderr: string;
  compileError: string | null;
  exitCode: number;
}

export const runCode = async (
  language: string,
  code: string,
  stdin: string = ""
): Promise<RunResult> => {
  const res = await api.post<RunResult>("/compiler/run", { language, code, stdin });
  return res.data;
};
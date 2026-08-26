import axios from "axios";
import { ExecutionResult } from "./types";

const WANDBOX_API = "https://wandbox.org/api/compile.json";

const COMPILER_MAP: Record<string, string> = {
  cpp: "gcc-13.2.0",
  python: "cpython-3.12.7",
};

interface WandboxResponse {
  status: string;
  signal?: string;
  compiler_output?: string;
  compiler_error?: string;
  compiler_message?: string;
  program_output?: string;
  program_error?: string;
  program_message?: string;
}

export const executeWithWandbox = async (
  language: string,
  code: string,
  stdin: string = ""
): Promise<ExecutionResult> => {
  const compiler = COMPILER_MAP[language];

  if (!compiler) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const response = await axios.post<WandboxResponse>(WANDBOX_API, {
    code,
    compiler,
    stdin,
  });

  const data = response.data;
  const succeeded = data.status === "0";

  const compileError =
    !succeeded
      ? data.compiler_error || data.compiler_message || null
      : null;

  return {
    stdout: data.program_output || "",
    stderr: data.program_error || "",
    compileError,
    exitCode: succeeded ? 0 : 1,
  };
};
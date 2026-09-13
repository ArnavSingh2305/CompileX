import axios from "axios";
import { ExecutionResult } from "./types";

const JUDGE0_API = process.env.JUDGE0_API_URL || "http://localhost:2358";

const LANGUAGE_IDS: Record<string, number> = {
  cpp: 54,     // C++ (GCC 9.2.0)
  python: 71,  // Python (3.8.1)
};

interface Judge0Response {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: { id: number; description: string };
}

const encode = (str: string) => Buffer.from(str, "utf-8").toString("base64");
const decode = (str: string | null) =>
  str ? Buffer.from(str, "base64").toString("utf-8") : "";

export const executeWithJudge0 = async (
  language: string,
  code: string,
  stdin: string = ""
): Promise<ExecutionResult> => {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) throw new Error(`Unsupported language: ${language}`);

  const response = await axios.post<Judge0Response>(
    `${JUDGE0_API}/submissions?base64_encoded=true&wait=true`,
    {
      source_code: encode(code),
      language_id: languageId,
      stdin: encode(stdin),

      cpu_time_limit: 2,
      wall_time_limit: 5,
      memory_limit: 128000,
      max_file_size: 5000,
    }
  );

  const data = response.data;
  const MAX_OUTPUT_LENGTH = 10000;

  const stdout = decode(data.stdout);
  const stderr = decode(data.stderr);

  const limitedStdout =
    stdout.length > MAX_OUTPUT_LENGTH
      ? stdout.slice(0, MAX_OUTPUT_LENGTH) + "\n[Output truncated]"
      : stdout;

  const limitedStderr =
    stderr.length > MAX_OUTPUT_LENGTH
      ? stderr.slice(0, MAX_OUTPUT_LENGTH) + "\n[Error output truncated]"
      : stderr;
  const compileError =
    data.status.id === 6 ? decode(data.compile_output) : null;

  return {
    stdout: limitedStdout,
    stderr: limitedStderr,
    compileError,
    exitCode: data.status.id === 3 ? 0 : 1,
  };
};
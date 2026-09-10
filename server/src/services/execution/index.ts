import { executeWithWandbox } from "./wandbox.provider";
import { executeWithJudge0 } from "./judge0.provider";
import { ExecutionResult } from "./types";

export const executeCode = async (
  language: string,
  code: string,
  stdin: string = ""
): Promise<ExecutionResult> => {
  const provider = process.env.EXECUTION_PROVIDER || "wandbox";

  if (provider === "wandbox") {
    return executeWithWandbox(language, code, stdin);
  }

  if (provider === "judge0") {
    return executeWithJudge0(language, code, stdin);
  }

  throw new Error(`Unknown execution provider: ${provider}`);
};
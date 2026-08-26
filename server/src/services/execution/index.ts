import { executeWithWandbox } from "./wandbox.provider";
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

  throw new Error(`Unknown execution provider: ${provider}`);
};
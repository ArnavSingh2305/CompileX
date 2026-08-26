export interface ExecutionResult {
  stdout: string;
  stderr: string;
  compileError: string | null;
  exitCode: number;
}
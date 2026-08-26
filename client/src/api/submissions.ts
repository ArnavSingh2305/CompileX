import api from "./axios";

export interface SubmitResult {
  status: "Accepted" | "Wrong Answer" | "Compilation Error" | "Runtime Error";
  passedTestCases: number;
  totalTestCases: number;
  results: {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    isHidden: boolean;
  }[];
}

export const submitSolution = async (
  problemSlug: string,
  language: string,
  code: string
): Promise<SubmitResult> => {
  const res = await api.post<SubmitResult>("/submissions", {
    problemSlug,
    language,
    code,
  });
  return res.data;
};
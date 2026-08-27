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
export interface SubmissionHistoryItem {
  _id: string;
  problem: { title: string; slug: string; difficulty: string };
  language: string;
  status: string;
  passedTestCases: number;
  totalTestCases: number;
  createdAt: string;
}

export const getSubmissionHistory = async (): Promise<SubmissionHistoryItem[]> => {
  const res = await api.get<SubmissionHistoryItem[]>("/submissions/history");
  return res.data;
};
export interface SubmissionDetail {
  _id: string;
  problem: { title: string; slug: string; difficulty: string };
  language: string;
  code: string;
  status: string;
  passedTestCases: number;
  totalTestCases: number;
  createdAt: string;
}

export const getSubmissionById = async (id: string): Promise<SubmissionDetail> => {
  const res = await api.get<SubmissionDetail>(`/submissions/${id}`);
  return res.data;
};

export const getSubmissionsByProblem = async (
  slug: string
): Promise<SubmissionHistoryItem[]> => {
  const res = await api.get<SubmissionHistoryItem[]>(`/submissions/problem/${slug}`);
  return res.data;
};
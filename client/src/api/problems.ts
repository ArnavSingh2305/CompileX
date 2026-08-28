import api from "./axios";

export interface ProblemSummary {
  _id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  solved: boolean;
}

export interface RunResultItem {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

export interface RunResponse {
  compileError: string | null;
  results: RunResultItem[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemDetail {
  _id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  description: string;
  constraints: string;
  examples: Example[];
  testCases: TestCase[];
}

export const getProblems = async (): Promise<ProblemSummary[]> => {
  const res = await api.get<ProblemSummary[]>("/problems");
  return res.data;
};

export const getProblemBySlug = async (slug: string): Promise<ProblemDetail> => {
  const res = await api.get<ProblemDetail>(`/problems/${slug}`);
  return res.data;
};

export const runAgainstPublicTests = async (
  slug: string,
  language: string,
  code: string
): Promise<RunResponse> => {
  const res = await api.post<RunResponse>(`/problems/${slug}/run`, { language, code });
  return res.data;
};

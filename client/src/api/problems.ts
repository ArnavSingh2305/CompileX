import api from "./axios";

export interface ProblemSummary {
  _id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  solved: boolean;
  bookmarked: boolean;
}

export interface ProblemFilters {
  search?: string;
  difficulty?: string;
  topic?: string;
  status?: string;
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
  bookmarked: boolean;
}

export const getProblems = async (filters: ProblemFilters = {}): Promise<ProblemSummary[]> => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.difficulty) params.append("difficulty", filters.difficulty);
  if (filters.topic) params.append("topic", filters.topic);
  if (filters.status) params.append("status", filters.status);

  const res = await api.get<ProblemSummary[]>(`/problems?${params.toString()}`);
  return res.data;
};

export const getAllTopics = async (): Promise<string[]> => {
  const res = await api.get<string[]>("/problems/topics");
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

export const toggleBookmark = async (slug: string): Promise<{ bookmarked: boolean }> => {
  const res = await api.post<{ bookmarked: boolean }>(`/bookmarks/${slug}/toggle`);
  return res.data;
};

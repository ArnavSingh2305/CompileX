import api from "./axios";

export interface ArticleSummary {
  _id: string;
  title: string;
  slug: string;
  category: string;
  topic: string;
  summary: string;
}

export interface CodeExample {
  language: string;
  code: string;
  caption?: string;
}

export interface RelatedProblem {
  _id: string;
  title: string;
  slug: string;
  difficulty: string;
}

export interface ArticleDetail extends ArticleSummary {
  content: string;
  codeExamples: CodeExample[];
  relatedProblems: RelatedProblem[];
}

export const getArticles = async (category?: string): Promise<ArticleSummary[]> => {
  const params = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await api.get<ArticleSummary[]>(`/articles${params}`);
  return res.data;
};

export const getArticleCategories = async (): Promise<string[]> => {
  const res = await api.get<string[]>("/articles/categories");
  return res.data;
};

export const getArticleBySlug = async (slug: string): Promise<ArticleDetail> => {
  const res = await api.get<ArticleDetail>(`/articles/${slug}`);
  return res.data;
};

export const getArticlesByTopic = async (topic: string): Promise<ArticleSummary[]> => {
  const res = await api.get<ArticleSummary[]>(`/articles/by-topic/${encodeURIComponent(topic)}`);
  return res.data;
};
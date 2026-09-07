import api from "./axios";

export const explainConcept = async (slug: string): Promise<string> => {
  const res = await api.get<{ reply: string }>(`/ai/explain/${slug}`);
  return res.data.reply;
};

export const getHint = async (slug: string, level: number, code: string): Promise<string> => {
  const res = await api.post<{ reply: string }>(`/ai/hint/${slug}`, { level, code });
  return res.data.reply;
};

export const debugCode = async (
  slug: string,
  code: string,
  language: string,
  errorOutput: string
): Promise<string> => {
  const res = await api.post<{ reply: string }>(`/ai/debug/${slug}`, { code, language, errorOutput });
  return res.data.reply;
};

export const explainComplexity = async (code: string, language: string): Promise<string> => {
  const res = await api.post<{ reply: string }>("/ai/complexity", { code, language });
  return res.data.reply;
};
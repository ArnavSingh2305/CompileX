import { GoogleGenAI } from "@google/genai";

export const askGemini = async (
  systemPrompt: string,
  userMessage: string
): Promise<string> => {
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const result = await genAI.models.generateContent({
    model: "gemini-3.6-flash",
    contents: `${systemPrompt}\n\n${userMessage}`,
  });

  return result.text || "";
};
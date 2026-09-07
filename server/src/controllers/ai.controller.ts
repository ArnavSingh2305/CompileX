import { Response } from "express";
import Problem from "../models/Problem";
import { askGemini } from "../services/ai/gemini.service";
import { AuthRequest } from "../middleware/auth.middleware";

const SAFETY_RULES = `You are an AI coding mentor inside a DSA practice platform called CompileX.
Rules you must always follow:
- Never give the complete working solution code unless explicitly asked in "solution" mode.
- Prefer guiding questions and conceptual nudges over direct answers.
- Never claim code is correct without the user actually running/testing it.
- Keep responses concise (under 150 words) and encouraging.
- If asked something unrelated to the current problem or programming, politely redirect to the topic at hand.`;

export const explainConcept = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const problem = await Problem.findOne({ slug });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const prompt = `${SAFETY_RULES}\n\nExplain the core concept/technique needed to solve this problem simply, without giving away the solution:\n\nTitle: ${problem.title}\nDescription: ${problem.description}`;
    const reply = await askGemini(SAFETY_RULES, prompt);
    res.status(200).json({ reply });
  } catch (error: any) {
    res.status(500).json({ message: "AI request failed", error: error.message });
  }
};

export const getHint = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const { level, code } = req.body; // level: 1-4, matching PRD 4.3

    const problem = await Problem.findOne({ slug });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const levelInstructions: Record<number, string> = {
      1: "Give a very gentle nudge about what general concept or observation applies here. Do not mention data structures or algorithms by name yet.",
      2: "Name the general technique or data structure that would help, but don't explain how to apply it yet.",
      3: "Explain roughly how to apply that technique to this specific problem, but don't write code.",
      4: "Give a more detailed step-by-step approach, still without full code.",
    };

    const prompt = `${SAFETY_RULES}\n\nProblem: ${problem.title}\n${problem.description}\n\nUser's current code attempt:\n${code || "(no code yet)"}\n\nHint level ${level}: ${levelInstructions[level] || levelInstructions[1]}`;
    const reply = await askGemini(SAFETY_RULES, prompt);
    res.status(200).json({ reply, level });
  } catch (error: any) {
    res.status(500).json({ message: "AI request failed", error: error.message });
  }
};

export const debugCode = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const { code, language, errorOutput } = req.body;

    const problem = await Problem.findOne({ slug });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const prompt = `DEBUG THIS CODE. Do not give a motivational introduction.

Problem: ${problem.title}
${problem.description}

Language: ${language}

Student's code:
${code}

Actual compiler/execution error:
${errorOutput}

Your response MUST:
1. Identify the specific cause of the actual error.
2. Point to the relevant part of the code.
3. Explain the minimal fix.
4. Do NOT provide the complete solution to the problem.
5. Do NOT give generic encouragement or introductory text.

Focus only on debugging the code and error provided above.`;

    const reply = await askGemini(SAFETY_RULES, prompt);

    res.status(200).json({ reply });
  } catch (error: any) {
    res.status(500).json({
      message: "AI request failed",
      error: error.message,
    });
  }
};

export const explainComplexity = async (req: AuthRequest, res: Response) => {
  try {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ message: "Code is required" });

    const prompt = `${SAFETY_RULES}\n\nAnalyze the time and space complexity of this ${language} code. Give Big-O for both and a one-sentence justification.\n\n${code}`;
    const reply = await askGemini(SAFETY_RULES, prompt);
    res.status(200).json({ reply });
  } catch (error: any) {
    res.status(500).json({ message: "AI request failed", error: error.message });
  }
};
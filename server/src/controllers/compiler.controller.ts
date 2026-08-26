import { Request, Response } from "express";
import { executeCode } from "../services/execution";

export const runCode = async (req: Request, res: Response) => {
  try {
    const { language, code, stdin } = req.body;

    if (!language || !code) {
      return res.status(400).json({ message: "Language and code are required" });
    }

    const result = await executeCode(language, code, stdin || "");
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Execution error:", error.message);
    res.status(500).json({
      message: "Code execution failed",
      error: error.response?.data?.message || error.message,
    });
  }
};
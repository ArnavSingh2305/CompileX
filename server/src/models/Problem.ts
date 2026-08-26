import mongoose, { Document, Schema } from "mongoose";

export interface ITestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface IProblem extends Document {
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  description: string;
  constraints: string;
  examples: { input: string; output: string; explanation?: string }[];
  testCases: ITestCase[];
  createdAt: Date;
}

const TestCaseSchema = new Schema<ITestCase>({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
});

const ProblemSchema = new Schema<IProblem>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  topics: [{ type: String }],
  description: { type: String, required: true },
  constraints: { type: String, default: "" },
  examples: [
    {
      input: String,
      output: String,
      explanation: String,
    },
  ],
  testCases: [TestCaseSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IProblem>("Problem", ProblemSchema);
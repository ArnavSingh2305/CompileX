import mongoose, { Document, Schema } from "mongoose";

export interface ICodeExample {
  language: string;
  code: string;
  caption?: string;
}

export interface IArticle extends Document {
  title: string;
  slug: string;
  category: string; // e.g. "DSA", "DBMS", "OOP", "Operating Systems"
  topic: string;     // e.g. "Two Pointers" — links to problem.topics
  summary: string;
  content: string;   // markdown body
  codeExamples: ICodeExample[];
  relatedProblemSlugs: string[];
  createdAt: Date;
}

const CodeExampleSchema = new Schema<ICodeExample>({
  language: { type: String, required: true },
  code: { type: String, required: true },
  caption: { type: String },
});

const ArticleSchema = new Schema<IArticle>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  topic: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  codeExamples: [CodeExampleSchema],
  relatedProblemSlugs: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IArticle>("Article", ArticleSchema);
import mongoose, { Document, Schema } from "mongoose";

export type SubmissionStatus =
  | "Accepted"
  | "Wrong Answer"
  | "Compilation Error"
  | "Runtime Error";

export interface ISubmission extends Document {
  user: mongoose.Types.ObjectId;
  problem: mongoose.Types.ObjectId;
  language: string;
  code: string;
  status: SubmissionStatus;
  passedTestCases: number;
  totalTestCases: number;
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  status: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "Compilation Error", "Runtime Error"],
    required: true,
  },
  passedTestCases: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISubmission>("Submission", SubmissionSchema);
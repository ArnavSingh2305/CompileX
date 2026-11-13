
import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "user" | "admin" | "teacher";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  teacherId?: mongoose.Types.ObjectId;
  mustChangePassword: boolean;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  googleId?: string;
  githubId?: string;
  authProviders: string[];
  createdAt: Date;
  totalSolved: number;
  totalPoints: number;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String },

  // Access control
  role: {
    type: String,
    enum: ["user", "admin", "teacher"],
    default: "user",
  },
  isActive: { type: Boolean, default: true },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  mustChangePassword: { type: Boolean, default: false },

  // Existing authentication fields
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  googleId: { type: String },
  githubId: { type: String },
  authProviders: { type: [String], default: [] },

  // Existing statistics
  createdAt: { type: Date, default: Date.now },
  totalSolved: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
});

export default mongoose.model<IUser>("User", UserSchema);

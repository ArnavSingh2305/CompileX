import mongoose, { Document, Schema } from "mongoose";

export interface IBookmark extends Document {
  user: mongoose.Types.ObjectId;
  problem: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
  createdAt: { type: Date, default: Date.now },
});

// prevent duplicate bookmarks of the same problem by the same user
BookmarkSchema.index({ user: 1, problem: 1 }, { unique: true });

export default mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
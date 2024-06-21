import mongoose from "mongoose";
import { User } from "./user";
import { UserProgress } from "./userProgress";
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    content: { type: String, required: true },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who upvoted
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who downvoted
  },
  { timestamps: true }
);

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

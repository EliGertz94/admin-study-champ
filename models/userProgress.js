import mongoose from "mongoose";
import { Question } from "./question"; // Assuming the file path is correct

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  //per course performence
  courses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      correctAnswers: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      ],
      incorrectAnswers: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
          },
          answeredAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],

  mostRecentActivity: { type: Date, default: Date.now },

  favoriteQuestions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  ], //  field for favorite questions

  rankings: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      rank: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      },
      completedAt: { type: Date },
    },
  ],
});

export const UserProgress =
  mongoose.models?.UserProgress ||
  mongoose.model("UserProgress", userProgressSchema);

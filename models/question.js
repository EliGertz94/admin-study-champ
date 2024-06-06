import mongoose from "mongoose";
export const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  hint: { type: String },
  correctOptionIndex: { type: String, required: true },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  difficultyLevel: { type: Number, required: true, default: 1 }, // Difficulty level of the question

  tags: [{ type: String }], // Add tags to categorize the questions - will have to clean cache and add to all the current questions

  // Optional explanations that can be used to generate personalized feedback
  explanation: { type: String },
});
export const Question =
  mongoose.models?.Question || mongoose.model("Question", questionSchema);

import mongoose from "mongoose";

export const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [
    {
      type: String,
      required: function () {
        return this.type === "regular";
      },
    },
  ],
  hint: { type: String },
  correctOptionIndex: {
    type: String,
    required: function () {
      return this.type === "regular" || this.type === "one-answer";
    },
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  difficultyLevel: {
    type: Number,
    required: function () {
      return this.type === "regular";
    },
    default: 1,
  }, // Difficulty level of the question

  tags: [{ type: String }], // Add tags to categorize the questions

  // Optional explanations that can be used to generate personalized feedback
  explanation: { type: String },
  type: {
    type: String,
    enum: ["regular", "content", "one-answer"],
    required: true,
    default: "regular",
  },
});

export const Question =
  mongoose.models?.Question || mongoose.model("Question", questionSchema);

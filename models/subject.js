import { model, models, Schema } from "mongoose";
import { questionSchema } from "./question";

export const subjectSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String }, // Content specific to the subject
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }], // Array of question references
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

export const Subject = models?.Subject || model("Subject", subjectSchema);

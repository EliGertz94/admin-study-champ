import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  generalContent: { type: String }, // General content for the course

  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
});
export const Course =
  mongoose.models?.Course || mongoose.model("Course", courseSchema);

//
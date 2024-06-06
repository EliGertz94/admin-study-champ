import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      enum: ["admin", "student", "teacher"],
      required: true,
    },
    isActive: { type: Boolean, default: true },
    phone: { type: String },
    image: { type: String },
    address: { type: String },
    progress: { type: mongoose.Schema.Types.ObjectId, ref: "UserProgress" },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);

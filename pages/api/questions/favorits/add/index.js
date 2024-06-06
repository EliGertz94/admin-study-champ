import mongoose from "mongoose";
import { UserProgress } from "@/models/userProgress";
import { connectToDB } from "@/lib/utils";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // End preflight requests quickly
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" }); // Method Not Allowed
  }

  const { userId, questionId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(questionId)
  ) {
    return res.status(400).json({ message: "Invalid userId or questionId" });
  }

  await connectToDB();

  try {
    const userProgress = await UserProgress.findOneAndUpdate(
      { userId },
      { $addToSet: { favoriteQuestions: questionId } }, // $addToSet ensures no duplicates
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(userProgress);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

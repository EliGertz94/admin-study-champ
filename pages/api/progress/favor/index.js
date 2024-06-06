// pages/api/user/[userId]/favorites.js
import { connectToDB } from "@/lib/utils";
import { User } from "@/models/user";
import { Question } from "@/models/question";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await connectToDB();

  const { userId } = req.query;

  if (req.method === "GET") {
    try {
      const user = await User.findById(userId).populate("favorites");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const favoriteQuestions = user.favorites.map((favorite) => ({
        _id: favorite._id,
        text: favorite.text,
      }));

      return res.status(200).json(favoriteQuestions);
    } catch (error) {
      console.error("Error fetching favorite questions:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}

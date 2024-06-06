import { connectToDB } from "@/lib/utils";
import { User } from "@/models/user";
import { UserProgress } from "@/models/userProgress"; // Ensure UserProgress is imported
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    // Preflight request, respond with 204 No Content
    return res.status(204).end();
  }

  await connectToDB();

  const { userId } = req.query;

  if (req.method === "PUT") {
    const { username, email, phone, address, password } = req.body;

    try {
      const updatedData = { username, email, phone, address };

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedData.password = hashedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      }).populate("progress");

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}

import { getSession } from "@/lib/SessionActions";
import { connectToDB } from "@/lib/utils";
import { User } from "@/models/user";
import { UserProgress } from "@/models/userProgress"; // Import UserProgress model
import bcrypt from "bcryptjs";

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

  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate("progress");

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Start session
    const session = await getSession(req, res);
    session.userId = user._id;
    session.username = user.email;
    session.isPro = user.isPro || false;
    session.isLoggedIn = true;
    await session.save();

    // Set session cookie
    res.setHeader("Set-Cookie", session.cookie);

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

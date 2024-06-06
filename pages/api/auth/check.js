import { connectToDB } from "@/lib/utils";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    // Preflight request, respond with 200 OK
    return res.status(200).end();
  }

  await connectToDB();
  // Retrieve token from HTTP-only cookie
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;

  //   console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token is valid, return success response
    res.status(200).json({ message: "Authenticated" });
  } catch (error) {
    // If token is invalid, return unauthorized response
    res.status(401).json({ error: "Unauthorized" });
  }
}

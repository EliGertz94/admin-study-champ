import { connectToDB } from "@/lib/utils";
import { selectQuestions } from "@/logic/automatedLearning/automatedLearning";

const handler = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  await connectToDB();

  if (req.method === "GET") {
    const { userId, courseId, totalQuestions } = req.query;

    if (!userId || !courseId || !totalQuestions) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const questions = await selectQuestions(
        userId,
        courseId,
        parseInt(totalQuestions)
      );
      return res.status(200).json(questions);
    } catch (error) {
      console.error("Error selecting questions:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
};

export default handler;

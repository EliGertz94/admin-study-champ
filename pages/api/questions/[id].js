//

// pages/api/subjects/index.js

import { connectToDB } from "@/lib/utils";
import { fetchQuestionsBySubject } from "@/logic/questions/questionsLogic";
import { Question } from "@/models/question";

const handler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  await connectToDB();

  try {
    const subjects = await fetchQuestionsBySubject();
    console.log(subjects);
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

export default handler;

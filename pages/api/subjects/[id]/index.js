// pages/api/subjects/index.js

import { connectToDB } from "@/lib/utils";
import { fetchQuestionsBySubject } from "@/logic/questions/questionsLogic";
import { fetchSubject } from "@/logic/subject/subjectLogic";

const handler = async (req, res) => {
  const { id } = req.query;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  connectToDB();

  try {
    const subject = await fetchSubject(id);
    console.log(subject);
    res.status(200).json(subject);
  } catch (error) {
    console.error("Error fetching courses", error);
    res.status(500).json({ error: "Failed to fetch Courses" });
  }
};

export default handler;

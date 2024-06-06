// pages/api/subjects/index.js

import { connectToDB } from "@/lib/utils";
import { fetchSubjectsByCourse } from "@/logic/subject/subjectLogic";
import { useRouter } from "next/router";

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
    const courses = await fetchSubjectsByCourse(id);
    console.log(courses);
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses", error);
    res.status(500).json({ error: "Failed to fetch Courses" });
  }
};

export default handler;

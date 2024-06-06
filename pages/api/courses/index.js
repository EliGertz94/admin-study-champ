import { connectToDB } from "@/lib/utils";
import { getAllCourses } from "@/logic/course/courseLogic";

const handler = async (req, res) => {
  const origin = req.headers.origin;

  res.setHeader("Access-Control-Allow-Origin", origin);

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(200).end();
    return;
  }

  connectToDB();

  try {
    const courses = await getAllCourses();

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses", error);
    res.status(500).json({ error: "Failed to fetch Courses" });
  }
};

export default handler;

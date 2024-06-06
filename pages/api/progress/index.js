import { UserProgress } from "@/models/userProgress";
import { connectToDB } from "@/lib/utils";

// Function to calculate rank based on correct answers count
const calculateRank = (correctAnswersCount) => {
  if (correctAnswersCount < 10) return "Beginner";
  if (correctAnswersCount < 20) return "Intermediate";
  if (correctAnswersCount < 30) return "Advanced";
  return "Expert";
};

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, courseId, questionId, isCorrect } = req.body;
  console.log(
    userId,
    courseId,
    questionId,
    isCorrect,
    "userId, courseId, questionId, isCorrect "
  );

  // Ensure that all required fields are present
  if (!userId || !courseId || !questionId || isCorrect === undefined) {
    return res.status(400).json({
      message:
        "All fields are required: userId, courseId, questionId, isCorrect",
    });
  }

  try {
    await connectToDB();

    let userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      userProgress = new UserProgress({ userId, courses: [], rankings: [] });
    }

    let courseProgress = userProgress.courses.find(
      (course) => course.courseId.toString() === courseId
    );

    console.log(courseProgress + " the given user course progress");

    if (!courseProgress) {
      courseProgress = { courseId, correctAnswers: [], incorrectAnswers: [] };
      userProgress.courses.push(courseProgress);
    }

    if (isCorrect) {
      if (!courseProgress.correctAnswers.includes(questionId)) {
        courseProgress.correctAnswers.push(questionId);
      }
    } else {
      if (
        !courseProgress.incorrectAnswers.some(
          (answer) => answer.questionId === questionId
        )
      ) {
        courseProgress.incorrectAnswers.push({
          questionId,
          answeredAt: new Date(),
        });
      }
    }

    const correctAnswersCount = courseProgress.correctAnswers.length;
    const rank = calculateRank(correctAnswersCount);

    const rankingIndex = userProgress.rankings.findIndex(
      (ranking) => ranking.courseId.toString() === courseId
    );

    if (rankingIndex !== -1) {
      userProgress.rankings[rankingIndex].rank = rank;
      userProgress.rankings[rankingIndex].completedAt = new Date();
    } else {
      userProgress.rankings.push({
        courseId,
        rank,
        completedAt: new Date(),
      });
    }

    userProgress.mostRecentActivity = new Date();

    await userProgress.save();
    res.status(200).json({ message: "Progress updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update progress" });
  }
}

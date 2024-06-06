import { UserProgress } from "@/models/userProgress";
import { Course } from "@/models/course";
import { Question } from "@/models/question";

// Data Collection:
//============================

// Retrieve the student's incorrectly answered questions for the specified course.
// Gather information about the subjects and questions within the course.

export async function getAnsweredQuestions(userId, courseId) {
  const userProgress = await UserProgress.findOne({ userId }).populate({
    path: "courses.courseId",
    match: { courseId: courseId },
    populate: {
      path: "incorrectAnswers.questionId",
      model: "Question",
      populate: {
        path: "subject",
        model: "Subject",
      },
    },
  });
  return userProgress.courses.find(
    (course) => course.courseId._id.toString() === courseId
  );
}

export async function getCourseDetails(courseId) {
  return await Course.findById(courseId).populate("subjects");
}

// Analyze Incorrect Answers:
//============================

// Calculate the frequency and proportion of incorrect answers by subject.
// Identify the most common tags within the incorrect answers, per subject.

const analyzeIncorrectAnswers = (incorrectAnswers) => {
  const subjectCount = {};
  const tagCountBySubject = {};
  let totalDifficulty = 0;

  incorrectAnswers.forEach((answer) => {
    const question = answer.questionId;
    const subject = question.subject.title;
    const tags = question.tags;

    // Count subjects
    if (!subjectCount[subject]) subjectCount[subject] = 0;
    subjectCount[subject]++;

    // Count tags by subject
    if (!tagCountBySubject[subject]) tagCountBySubject[subject] = {};
    tags.forEach((tag) => {
      if (!tagCountBySubject[subject][tag]) tagCountBySubject[subject][tag] = 0;
      tagCountBySubject[subject][tag]++;
    });

    // Calculate total difficulty
    totalDifficulty += question.difficultyLevel;
  });

  const avgDifficulty =
    incorrectAnswers.length > 0 ? totalDifficulty / incorrectAnswers.length : 1;

  return { subjectCount, tagCountBySubject, avgDifficulty };
};

//   Adjust Difficulty Level:
//============================
// Calculate the average difficulty level of the incorrectly answered questions.
// Set a target difficulty level for the new questions.

const adjustDifficultyLevel = (avgDifficulty) => {
  return Math.max(1, avgDifficulty - 1); // Ensure difficulty doesn't drop below 1
};

// Question Selection:
//============================
// Filter the question bank for questions related to the most frequent subjects and tags.
// Select questions based on the calculated proportions and target difficulty level.
const selectQuestions = (
  questionBank,
  subjectCount,
  tagCountBySubject,
  targetDifficulty,
  totalQuestions
) => {
  const selectedQuestions = [];
  const subjectProportions = {};

  // Calculate subject proportions
  const totalIncorrect = Object.values(subjectCount).reduce(
    (sum, count) => sum + count,
    0
  );
  Object.keys(subjectCount).forEach((subject) => {
    subjectProportions[subject] = Math.round(
      (subjectCount[subject] / totalIncorrect) * totalQuestions
    );
  });

  Object.keys(subjectProportions).forEach((subject) => {
    const questionsForSubject = questionBank.filter(
      (q) =>
        q.subject.title === subject && q.difficultyLevel <= targetDifficulty
    );
    const tagCount = tagCountBySubject[subject];

    // Sort questions by tag frequency
    questionsForSubject.sort((a, b) => {
      const aTagScore = a.tags.reduce(
        (score, tag) => score + (tagCount[tag] || 0),
        0
      );
      const bTagScore = b.tags.reduce(
        (score, tag) => score + (tagCount[tag] || 0),
        0
      );
      return bTagScore - aTagScore;
    });

    selectedQuestions.push(
      ...questionsForSubject.slice(0, subjectProportions[subject])
    );
  });

  return selectedQuestions.slice(0, totalQuestions);
};

// ---------------optional --------------------

//   Generate Personalized Explanations:
//=======================================
// Generate detailed explanations for each selected question

const generateExplanations = (selectedQuestions) => {
  return selectedQuestions.map((question) => {
    const explanation = generateExplanation(question); // Placeholder function
    return { question, explanation };
  });
};

// Placeholder explanation generator
const generateExplanation = (question) => {
  return `Explanation for question ${
    question._id
  }: Review the concept of ${question.tags.join(", ")}.`;
};

// Example usage
async function generateOptimalLearningSession(
  userId,
  courseId,
  totalQuestions = 10
) {
  const courseData = await getAnsweredQuestions(userId, courseId);
  const questionBank = await Question.find().populate("subject");

  const { subjectCount, tagCountBySubject, avgDifficulty } =
    analyzeIncorrectAnswers(courseData.incorrectAnswers);
  const targetDifficulty = adjustDifficultyLevel(avgDifficulty);
  const selectedQuestions = selectQuestions(
    questionBank,
    subjectCount,
    tagCountBySubject,
    targetDifficulty,
    totalQuestions
  );
  const optimalLearningSession = generateExplanations(selectedQuestions);

  return optimalLearningSession;
}

generateOptimalLearningSession("user123", "course456", 10).then((session) => {
  console.log(session);
});

import { UserProgress } from "@/models/userProgress";
import { Course } from "@/models/course";
import { Question } from "@/models/question";

export async function selectQuestions(userId, courseId, totalQuestions) {
  // getting the progress from the user
  const userProgress = await UserProgress.findOne({ userId }).populate({
    path: "courses.courseId courses.incorrectAnswers.questionId",
  });

  if (!userProgress) throw new Error("User progress not found.");
  //getting all the courses from the progress by Course
  const courseProgress = userProgress.courses.find((course) =>
    course.courseId.equals(courseId)
  );
  if (!courseProgress) throw new Error("Course progress not found.");

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  //getting only the incorrect answers from the last week
  const recentIncorrectAnswers = courseProgress.incorrectAnswers.filter(
    (incorrect) => incorrect.answeredAt >= oneWeekAgo
  );

  const subjectFrequency = {};
  const tagFrequencyBySubject = {};
  const difficultySumBySubject = {};
  const questionCountBySubject = {};
  //looping the incorrect answers
  recentIncorrectAnswers.forEach((incorrect) => {
    const question = incorrect.questionId;
    const subjectId = question.subject.toString();
    //editing the amount of questions in each subject
    subjectFrequency[subjectId] = (subjectFrequency[subjectId] || 0) + 1;
    //the sum of difficulty level per subject
    difficultySumBySubject[subjectId] =
      (difficultySumBySubject[subjectId] || 0) + question.difficultyLevel;
    // the count of questions per subject
    questionCountBySubject[subjectId] =
      (questionCountBySubject[subjectId] || 0) + 1;
    //creating the mapping for Frequency of tags by questions
    question.tags.forEach((tag) => {
      if (!tagFrequencyBySubject[subjectId]) {
        tagFrequencyBySubject[subjectId] = {};
      }
      tagFrequencyBySubject[subjectId][tag] =
        (tagFrequencyBySubject[subjectId][tag] || 0) + 1;
    });
  });

  const totalIncorrectAnswers = recentIncorrectAnswers.length;
  //The amount of Questions needed for each subject
  const questionsPerSubject = {};

  const preferredDifficultyBySubject = {};

  for (const [subjectId, count] of Object.entries(subjectFrequency)) {
    //Average difficulty according to subject
    const avgDifficulty =
      difficultySumBySubject[subjectId] / questionCountBySubject[subjectId];

    const preferredDifficulty = Math.floor(avgDifficulty) - 1;
    //preferred difficulty level per subject
    preferredDifficultyBySubject[subjectId] = preferredDifficulty;

    questionsPerSubject[subjectId] = Math.round(
      (count / totalIncorrectAnswers) * totalQuestions
    );
  }
  //========================== Question Selection ==================================
  let selectedQuestions = [];
  const selectedQuestionIds = new Set();
  //loop through subjects and the amount of questions

  for (const [subjectId, count] of Object.entries(questionsPerSubject)) {
    //Creating range for difficulty level
    const preferredDifficulty = preferredDifficultyBySubject[subjectId];
    const maxDifficulty = Math.min(5, preferredDifficulty + 1);
    const minDifficulty = Math.max(1, preferredDifficulty);

    //Selecting Questions by subject and difficulty range
    const questionsForSubject = await Question.find({
      subject: subjectId,
      difficultyLevel: { $gte: minDifficulty, $lte: maxDifficulty },
    });

    //making sure questions are unique and were not answered before
    const filteredQuestions = questionsForSubject.filter(
      (q) =>
        !courseProgress.correctAnswers.includes(q._id) &&
        !recentIncorrectAnswers.some((incorrect) =>
          incorrect.questionId.equals(q._id)
        )
    );

    const tagFrequency = tagFrequencyBySubject[subjectId] || {};

    filteredQuestions.sort((a, b) => {
      const aTagScore = a.tags.reduce(
        (score, tag) => score + (tagFrequency[tag] || 0),
        0
      );
      const bTagScore = b.tags.reduce(
        (score, tag) => score + (tagFrequency[tag] || 0),
        0
      );
      return bTagScore - aTagScore;
    });

    let selectedForSubject = filteredQuestions.slice(0, count);

    // making sure the right amount of questions will be generated
    if (selectedForSubject.length < count) {
      const expandedRangeQuestions = await Question.find({
        subject: subjectId,
        difficultyLevel: { $gte: minDifficulty, $lte: maxDifficulty + 1 },
        _id: { $nin: Array.from(selectedQuestionIds) }, // Ensure valid array
      });

      selectedForSubject = selectedForSubject.concat(
        expandedRangeQuestions.slice(0, count - selectedForSubject.length)
      );
    }

    selectedForSubject.forEach((q) => {
      if (!selectedQuestionIds.has(q._id.toString())) {
        selectedQuestions.push(q);
        selectedQuestionIds.add(q._id.toString());
      }
    });
  }

  if (selectedQuestions.length < totalQuestions) {
    const remainingQuestions = await Question.find({
      _id: { $nin: Array.from(selectedQuestionIds) }, // Ensure valid array
      subject: { $in: Object.keys(subjectFrequency) },
      difficultyLevel: { $gte: 1, $lte: 5 },
    });

    selectedQuestions = selectedQuestions.concat(
      remainingQuestions.slice(0, totalQuestions - selectedQuestions.length)
    );
  }

  return selectedQuestions;
}

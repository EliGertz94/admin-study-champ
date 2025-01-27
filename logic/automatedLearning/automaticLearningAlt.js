import { UserProgress } from "@/models/userProgress";
import { Course } from "@/models/course";
import { Question } from "@/models/question";

async function selectQuestions(userId, courseId, totalQuestions) {
  const userProgress = await UserProgress.findOne({ userId }).populate({
    path: "courses.courseId courses.incorrectAnswers.questionId",
  });
  //** is it good enouth to use  path: "courses.courseId courses.incorrectAnswers.questionId", and not mention the field am i going to get the subject of the question */

  if (!userProgress) throw new Error("User progress not found.");

  // getting the specific userprogress for a specific course

  const courseProgress = userProgress.courses.find((course) =>
    course.courseId.equals(courseId)
  );
  if (!courseProgress) throw new Error("Course progress not found.");

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Filter incorrect answers in the last week
  const recentIncorrectAnswers = courseProgress.incorrectAnswers.filter(
    (incorrect) => incorrect.answeredAt >= oneWeekAgo
  );

  const subjectFrequency = {};
  const tagFrequencyBySubject = {};

  // Calculate frequencies

  recentIncorrectAnswers.forEach((incorrect) => {
    const question = incorrect.questionId;
    const subjectId = question.subject.toString();
    //update mapping to questions by subject
    subjectFrequency[subjectId] = (subjectFrequency[subjectId] || 0) + 1;

    //looping threw all the #tags#
    question.tags.forEach((tag) => {
      if (!tagFrequencyBySubject[subjectId]) {
        tagFrequencyBySubject[subjectId] = {};
      }
      //editing tag amount by subject
      tagFrequencyBySubject[subjectId][tag] =
        (tagFrequencyBySubject[subjectId][tag] || 0) + 1;
    });
  });

  const totalIncorrectAnswers = recentIncorrectAnswers.length;

  const questionsPerSubject = {};
  //looping the questions amount by subject
  //======================================
  for (const [subjectId, count] of Object.entries(subjectFrequency)) {
    //amount of questions that needs to be generated by subject
    questionsPerSubject[subjectId] = Math.round(
      (count / totalIncorrectAnswers) * totalQuestions
    );
  }

  let selectedQuestions = [];
  const selectedQuestionIds = new Set();

  // looping the subjectId's by amount of questions and tags
  //======================================

  for (const [subjectId, count] of Object.entries(questionsPerSubject)) {
    const questionsForSubject = await Question.find({ subject: subjectId });

    // Exclude previously answered questions correctly and not
    const filteredQuestions = questionsForSubject.filter(
      (q) =>
        !courseProgress.correctAnswers.includes(q._id) &&
        !recentIncorrectAnswers.some((incorrect) =>
          incorrect.questionId.equals(q._id)
        )
    );
    // %%%%%%%%%%%%%%%%%%%%%% continue from here %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // Calculate tag frequencies for this subject
    const tagFrequency = tagFrequencyBySubject[subjectId] || {};

    // Sort usable questions by tag frequency
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

    // Ordered by tag frequencies questions will choose the right amount
    const selectedForSubject = filteredQuestions.slice(0, count);

    // Add selected questions to the final list
    selectedForSubject.forEach((q) => {
      if (!selectedQuestionIds.has(q._id.toString())) {
        selectedQuestions.push(q);
        selectedQuestionIds.add(q._id.toString());
      }
    });
  }

  // Handle edge case: Total selected questions less than required
  if (selectedQuestions.length < totalQuestions) {
    // Fetch remaining questions from the entire pool, ensuring no repeats
    const remainingQuestions = await Question.find({
      _id: { $nin: Array.from(selectedQuestionIds) },
      subject: { $in: Object.keys(subjectFrequency) },
    });

    selectedQuestions = selectedQuestions.concat(
      remainingQuestions.slice(0, totalQuestions - selectedQuestions.length)
    );
  }

  return selectedQuestions;
}

module.exports = { selectQuestions };

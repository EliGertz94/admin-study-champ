"use server";
import { connectToDB } from "@/lib/utils";

import { Question } from "@/models/question";
import { Subject } from "@/models/subject";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
//recive all questions
export const getAllQuestions = async () => {
  try {
    connectToDB();
    const questions = await Question.find();

    return questions;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch Questions!");
  }
};

export const addQuestion = async (formData) => {
  const { text, options, hint, correctOptionIndex, subject, tags } =
    Object.fromEntries(formData);

  try {
    await connectToDB();

    const optionsArray = options.split(",");
    const tagsArray = tags.split(",");

    // Save the new question
    const newQuestion = new Question({
      text: text,
      options: optionsArray,
      hint: hint,
      correctOptionIndex: correctOptionIndex,
      subject: subject,
      tags: tagsArray,
    });
    const savedQuestion = await newQuestion.save();
    const questionId = savedQuestion._id; // Get the ID of the newly saved question

    // Update the subject document to add the question ID to the questions array
    await Subject.findByIdAndUpdate(
      subject,
      { $push: { questions: questionId } }, // Add questionId to the questions array
      { new: true } // Return the updated document
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save Question!");
  }

  revalidatePath("/dashboard/courses");
  redirect("/dashboard/courses");
};
export const addContentQuestion = async (formData) => {
  const { text, subject } = Object.fromEntries(formData);

  try {
    await connectToDB();

    // const tagsArray = tags.split(",");

    // Save the new content question
    const newContentQuestion = new Question({
      text: text,
      subject: subject,
      type: "content",
    });

    const savedQuestion = await newContentQuestion.save();
    const questionId = savedQuestion._id; // Get the ID of the newly saved question

    // Update the subject document to add the question ID to the questions array
    await Subject.findByIdAndUpdate(
      subject,
      { $push: { questions: questionId } }, // Add questionId to the questions array
      { new: true } // Return the updated document
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save Content Question!");
  }

  revalidatePath("/dashboard/courses");
  redirect("/dashboard/courses");
};

export const addQuestion2 = async (
  text,
  options,
  hint,
  correctOptionIndex,
  subject,
  tags
) => {
  try {
    await connectToDB();

    const optionsArray = options.split(",");
    const tagsArray = tags.split(",");

    // Save the new question
    const newQuestion = new Question({
      text: text,
      options: optionsArray,
      hint: hint,
      correctOptionIndex: correctOptionIndex,
      subject: subject,
      tags: tagsArray,
    });
    const savedQuestion = await newQuestion.save();
    const questionId = savedQuestion._id; // Get the ID of the newly saved question

    // Update the subject document to add the question ID to the questions array
    await Subject.findByIdAndUpdate(
      subject,
      { $push: { questions: questionId } }, // Add questionId to the questions array
      { new: true } // Return the updated document
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save Question!");
  }

  revalidatePath("/dashboard/courses");
  redirect("/dashboard/courses");
};

// get all questions by subject id

export const fetchQuestionsBySubject = async (subjectId) => {
  try {
    connectToDB();
    const subjects = await Question.find({ subject: subjectId });
    console.log(subjects);
    return subjects;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch subject!");
  }
};
const questionsData = [
  {
    text: `\(\tan\left(\frac{\pi}{4}\right)\)`,
    options: `\(1 \quad\),\(\sqrt{3}\)`,
    hint: `\(\tan\left(\frac{\pi}{4}\right) = 1\)`,
    correctOptionIndex: "(1 quad)",
    subject: `66641ae6ee8d1b1422d5c89a`,
    tags: `special cases, tangent, advanced trigonometry`,
  },
  {
    text: `\\tan(2a)`,
    options: `(\\frac{2 \\tan a}{1 - \\tan^2 a} \quad),(\\frac{2 \\sin a \\cos a}{\\cos^2 a - \\sin^2 a})`,
    hint: `Use \\(\\tan(2a) = \\frac{2 \\tan a}{1 - \\tan^2 a}\\)`,
    correctOptionIndex: 0,
    subject: `66641a73ee8d1b1422d5c880`,
    tags: `double-angle formulas, tangent, trigonometry`,
  },
  // Continue with other questions up to 90
  {
    text: `\\tan(a + b)`,
    options: `(\\frac{\\tan a + \\tan b}{1 - \\tan a \\tan b} \quad),(\\frac{\\tan a - \\tan b}{1 + \\tan a \\tan b})`,
    hint: `Use \\(\\tan(a \\pm b) = \\frac{\\tan a \\pm \\tan b}{1 \\mp \\tan a \\tan b}\\)`,
    correctOptionIndex: 0,
    subject: `66641a73ee8d1b1422d5c880`,
    tags: `sum and difference formulas, tangent, advanced trigonometry, identity transformation`,
  },
  {
    text: `\\sin(4a)`,
    options: `(2 \\sin(2a) \\cos(2a) \quad),(\\sin^2(2a) - \\cos^2(2a))`,
    hint: `Use \\(\\sin(2a) = 2 \\sin a \\cos a\\)`,
    correctOptionIndex: 0,
    subject: `66641a73ee8d1b1422d5c880`,
    tags: `double-angle formulas, sine, advanced trigonometry, identity transformation`,
  },
  {
    text: `\\cos(4a)`,
    options: `(2 \\cos^2(2a) - 1 \quad),(2 \\sin^2(2a) - 1)`,
    hint: `Use \\(\\cos(2a) = 2 \\cos^2 a - 1\\)`,
    correctOptionIndex: 0,
    subject: `66641a73ee8d1b1422d5c880`,
    tags: `double-angle formulas, cosine, advanced trigonometry, identity transformation`,
  },
  {
    text: `\\frac{1 + \\cos(2a)}{\\sin(2a)}`,
    options: `(\\cot a \quad),(\\tan a)`,
    hint: `Use \\(\\cos(2a) = 1 - 2 \\sin^2 a\\) and \\(\\sin(2a) = 2 \\sin a \\cos a\\)`,
    correctOptionIndex: 0,
    subject: `66641a73ee8d1b1422d5c880`,
    tags: `double-angle formulas, tangent, cotangent, advanced trigonometry`,
  },
  {
    text: `\\sin(6a)`,
    options: `(2 \\sin(3a) \\cos(3a) \quad),(\\sin(3a) + \\cos(3a))`,
    hint: `Use \\(\\sin(2a) = 2 \\sin a \\cos a\\) recursively`,
    correctOptionIndex: 0,
    subject: `66641a73ee8d1b1422d5c880`,
    tags: `triple-angle formulas, sine, advanced trigonometry`,
  },
  // Continue adding formatted questions up to question 90
];

export const addAllQuestions = async () => {
  const questionsData = [
    {
      text: `\(\tan\left(\frac{\pi}{4}\right)\)`,
      options: `\(1 \quad\),\(\sqrt{3}\)`,
      hint: `\(\tan\left(\frac{\pi}{4}\right) = 1\)`,
      correctOptionIndex: "(1 quad)",
      subject: `66641ae6ee8d1b1422d5c89a`,
      tags: `special cases, tangent, advanced trigonometry`,
    },
    // Add more questions here
  ];

  try {
    // for (const questionData of questionsData) {
    // const { text, options, hint, correctOptionIndex, subject, tags } =
    //   questionData;
    await addQuestion2(
      questionsData.text,
      questionsData.options,
      questionsData.hint,
      questionsData.correctOptionIndex,
      questionsData.subject,
      questionsData.tags
    );
    // Redirect after adding all questions
    revalidatePath("/dashboard/courses");
    redirect("/dashboard/courses");
    // }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save questions!");
  }
};

export const updateQuestionsType = async () => {
  try {
    // Connect to the database
    await connectToDB();

    // Update all questions to set their type to "regular"
    const updateResult = await Question.updateMany(
      {}, // Match all documents
      { $set: { type: "regular" } } // Set type to "regular"
    );

    console.log(`${updateResult} documents were updated`);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update questions!");
  }
};

"use server";
import { connectToDB } from "@/lib/utils";

import { Question } from "@/models/question";
import { Subject } from "@/models/subject";
import mongoose from "mongoose";

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
  mongoose.deleteModel("User");
  const { text, options, hint, correctOptionIndex, subject, tags } =
    Object.fromEntries(formData);
  try {
    connectToDB();

    const optionsArray = options.split(",");
    const tagsArray = tags.split(",");
    console.log(tagsArray);
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

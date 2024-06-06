"use server";
import { Subject } from "@/models/subject";
import { connectToDB } from "@/lib/utils";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
export const addSubject = async (formData) => {
  const { title, content, course } = Object.fromEntries(formData);

  try {
    connectToDB();

    const newSubject = new Subject({
      title: title,
      content: content,
      course: course,
    });

    await newSubject.save();
    console.log("newSubject created successfully!", newSubject);
    // mongoose.deleteModel("Subject");
  } catch (error) {
    console.error("Error creating subject:", error.message);
  }

  revalidatePath("/dashboard/subjects");
  redirect("/dashboard/subjects");
};

export const fetchSubjects = async (q, page) => {
  console.log(q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 5;

  try {
    connectToDB();
    const count = await Subject.find({ title: { $regex: regex } }).count();
    const subjects = await Subject.find({ title: { $regex: regex } })
      .populate("course")
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, subjects: subjects };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch subjects!");
  }
};

export const fetchSubject = async (id) => {
  try {
    connectToDB();
    const subject = await Subject.findById(id).populate("questions");
    console.log(subject);
    return subject;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch subject!");
  }
};

// get all subject by course id

export const fetchSubjectsByCourse = async (courseId) => {
  try {
    connectToDB();
    const subjects = await Subject.find({ course: courseId }).populate(
      "questions"
    );
    console.log(subjects);
    return subjects;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch subject!");
  }
};

export const updateSubject = async (formData) => {
  const { id, title, content } = Object.fromEntries(formData);
  const questions = formData.getAll("questions");

  let questionIds = [];

  // Ensure questions is handled as an array, and filter out any invalid ObjectIds
  if (Array.isArray(questions)) {
    questionIds = questions.filter((question) => question); // Filter out empty strings
  } else if (questions) {
    questionIds = [questions].filter((question) => question); // Ensure it's an array and filter out empty strings
  }

  console.log("id", id, "title", title, content, "questions", questionIds);

  try {
    connectToDB();

    // mongoose.deleteModel("Subject");
    const updateFields = {
      title: title,
      content: content,
      questions: questionIds,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await Subject.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update Subject!");
  }

  revalidatePath("/dashboard/subjects");
  redirect("/dashboard/subjects");
};

export const getAllSubjects = async () => {
  try {
    connectToDB();
    const subjects = await Subject.find();

    return subjects;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch Subject!");
  }
};

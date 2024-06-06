"use server";
import { connectToDB } from "@/lib/utils";
import { Course } from "@/models/course";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { User } from "@/models/user";

export const fetchCourses = async (q, page) => {
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 5;

  try {
    connectToDB();
    const count = await Course.find({ title: { $regex: regex } }).count();
    console.log(count);
    const courses = await Course.find({ title: { $regex: regex } })
      .populate("author")
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, courses: courses };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch courses!");
  }
};

export const getAllCourses = async () => {
  try {
    connectToDB();
    const courses = await Course.find().populate("author");

    return courses;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch courses!");
  }
};
export const fetchCourse = async (id) => {
  try {
    connectToDB();
    const course = await Course.findById(id).populate("author");
    return course;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch course!");
  }
};

export const addCourse = async (formData) => {
  const { title, description, price, author, generalContent } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const newCourse = new Course({
      title: title,
      description: description,
      price: price,
      author: author,
      generalContent: generalContent,
    });

    await newCourse.save();
    console.log("Course created successfully!", newCourse);

    // mongoose.deleteModel("Course");
  } catch (error) {
    console.error("Error creating course:", error.message);
  }

  revalidatePath("/dashboard/courses");
  redirect("/dashboard/courses");
};

export const getTeachers = async () => {
  try {
    const teachers = await User.find({ userType: "teacher" });
    return teachers;
  } catch (error) {
    console.error("Error fetching teachers:", error.message);
  }
};

export const updateCourse = async (formData) => {
  const { id, title, price, generalContent, author, description } =
    Object.fromEntries(formData);
  console.log(formData, id);
  try {
    connectToDB();

    const updateFields = {
      title: title,
      price: price,
      generalContent: generalContent,
      author: author,
      description: description,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await Course.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update course!");
  }

  revalidatePath("/dashboard/courses");
  redirect("/dashboard/courses");
};

export const deleteCourse = async (formData) => {
  const { id, title } = Object.fromEntries(formData);
  console.log(id, "id");
  try {
    connectToDB();
    await Course.findByIdAndDelete(id);
    console.log(`course with username ${title} was deleted`);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete course!");
  }

  revalidatePath("/dashboard/courses");
};

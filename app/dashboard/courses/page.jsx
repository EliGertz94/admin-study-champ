import React from "react";
import styles from "@/ui/dashboard/courses/courses.module.css";
import Search from "@/ui/dashboard/search/search";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/ui/dashboard/pagination/pagination";
import { fetchCourses } from "@/logic/course/courseLogic";
import { deleteCourse } from "@/logic/course/courseLogic";
const Courses = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, courses } = await fetchCourses(q, page);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder={"Searching for ..."} />
        <Link href="/dashboard/courses/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>title</td>
            <td>description</td>
            <td>price</td>
            <td>author</td>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course?._id}>
              <td>
                <div className={styles.product}>
                  <Image
                    src={course.img || "/noproduct.jpg"}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.productImage}
                  />
                  {course.title}
                </div>
              </td>

              <td>{course.description}</td>
              <td>${course.price}</td>
              <td>{course.author.username}</td>

              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/courses/${course.id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <form action={deleteCourse}>
                    <input type="hidden" name="id" value={course.id} />
                    <input type="hidden" name="title" value={course.title} />
                    <button
                      type="submit"
                      className={`${styles.button} ${styles.delete}`}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination count={count} />
    </div>
  );
};

export default Courses;

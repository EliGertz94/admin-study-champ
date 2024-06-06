// import { updateProduct } from "@/app/lib/actions";
import {
  fetchCourse,
  getAllCourses,
  getTeachers,
  updateCourse,
} from "@/logic/course/courseLogic";
import { addSubject } from "@/logic/subject/subjectLogic";
import styles from "@/ui/dashboard/courses/singleCourse/singleCourse.module.css";
import Image from "next/image";

const SingleProductPage = async ({ params }) => {
  const { id } = params;
  const course = await fetchCourse(id);
  const courses = await getAllCourses();
  const teachers = await getTeachers();
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image src="/noavatar.png" alt="" fill />
        </div>
        {course.title}
      </div>
      <div className={styles.formContainer}>
        <form action={updateCourse} className={styles.form}>
          <input type="hidden" name="id" value={course.id} />
          <label>Title</label>
          <input type="text" name="title" placeholder={course.title} />
          <label>Price</label>
          <input type="number" name="price" placeholder={course.price} />

          <label>generalContent</label>
          <textarea
            type="text"
            name="generalContent"
            placeholder={course.generalContent}
          />
          <label>Author</label>
          <select
            name="author"
            id="author"
            defaultValue={course.author._id.toString()}
          >
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id.toString()}>
                {teacher.username}
              </option>
            ))}
          </select>
          <label>Description</label>
          <textarea
            name="description"
            id="description"
            rows="10"
            placeholder={course.description}
          ></textarea>
          <button>Update</button>
        </form>
        {/* subject form */}
        <br />
        <h1>Add subject</h1>
        <br />

        <form action={addSubject} className={styles.form}>
          <label>Title</label>
          <input
            required
            id="title"
            type="text"
            name="title"
            placeholder="title"
          />

          <label>content</label>
          <textarea
            required
            id="content"
            type="text"
            name="content"
            placeholder="content"
          />

          <input
            required
            id="course"
            type="hidden"
            name="course"
            placeholder="title"
            value={id}
          />
          <button>Add</button>
        </form>
      </div>
    </div>
  );
};

export default SingleProductPage;

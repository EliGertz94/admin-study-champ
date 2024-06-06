// import { addProduct } from "@/app/lib/actions";
import styles from "@/ui/dashboard/courses/addCourses/addCourses.module.css";
import { addCourse, getTeachers } from "@/logic/course/courseLogic";
const AddProductPage = async () => {
  const teachers = await getTeachers();

  return (
    <div className={styles.container}>
      <form className={styles.form} action={addCourse}>
        <input type="text" placeholder="title" name="title" required />

        <input type="number" placeholder="price" name="price" required />
        <select name="author" id="author">
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id.toString()}>
              {teacher.username}
            </option>
          ))}
        </select>
        <textarea
          required
          name="description"
          id="description"
          rows="16"
          placeholder="Description"
        ></textarea>
        <textarea
          required
          name="generalContent"
          id="generalContent"
          rows="16"
          placeholder="generalContent"
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddProductPage;

import React from "react";
import styles from "@/ui/dashboard/courses/courses.module.css";
import styles2 from "@/ui/dashboard/users/singleUser/singleUser.module.css";
import Search from "@/ui/dashboard/search/search";
import Link from "next/link";
import Pagination from "@/ui/dashboard/pagination/pagination";
import { deleteCourse } from "@/logic/course/courseLogic";
import { fetchSubjects, getAllSubjects } from "@/logic/subject/subjectLogic";
import {
  addAllQuestions,
  addQuestion,
  addContentQuestion,
} from "@/logic/questions/questionsLogic";

const Subjects = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, subjects } = await fetchSubjects(q, page);
  const allSubjects = await getAllSubjects();

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
            <td>course</td>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject?._id}>
              <td>{subject.title}</td>
              <td>{subject.course.title}</td>

              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/subjects/${subject.id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <form action={deleteCourse}>
                    <input type="hidden" name="id" value={subject.id} />
                    <input type="hidden" name="title" value={subject.title} />
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

      <br />
      <h1>Add Regular Question</h1>
      <br />
      <AddRegularQuestionForm allSubjects={allSubjects} />

      <br />
      <h1>Add Content Question</h1>
      <br />
      <AddContentQuestionForm allSubjects={allSubjects} />
    </div>
  );
};

const AddRegularQuestionForm = ({ allSubjects }) => {
  return (
    <form action={addQuestion} method="post" className={styles2.form}>
      <input type="hidden" name="type" value="regular" />

      <label>Text</label>
      <input required id="text" type="text" name="text" placeholder="Text" />

      <label>Options (option1, option2 ...)</label>
      <textarea
        required
        id="options"
        type="text"
        name="options"
        placeholder="Options"
      />

      <label>Hint</label>
      <input required id="hint" type="text" name="hint" placeholder="Hint" />

      <label>Correct Answer</label>
      <input
        required
        id="correctOptionIndex"
        type="text"
        name="correctOptionIndex"
        placeholder="Correct Answer"
      />

      <label>Tags</label>
      <input
        required
        id="tags"
        type="text"
        name="tags"
        placeholder="tag1,tag2,tag3,..."
      />

      <label>Add To Subject</label>
      <select name="subject" id="subject">
        {allSubjects.map((subject) => (
          <option key={subject._id} value={subject._id.toString()}>
            {subject.title}
          </option>
        ))}
      </select>

      <button>Add Regular Question</button>
    </form>
  );
};

const AddContentQuestionForm = ({ allSubjects }) => {
  return (
    <form action={addContentQuestion} method="post" className={styles2.form}>
      <input type="hidden" name="type" value="content" />

      <label>Text</label>
      <input required id="text" type="text" name="text" placeholder="Text" />

      {/* <label>Hint</label>
      <input required id="hint" type="text" name="hint" placeholder="Hint" /> */}

      {/* <label>Tags</label>
      <input
        required
        id="tags"
        type="text"
        name="tags"
        placeholder="tag1,tag2,tag3,..."
      /> */}

      <label>Add To Subject</label>
      <select name="subject" id="subject">
        {allSubjects.map((subject) => (
          <div>
            <option key={subject._id} value={subject._id.toString()}>
              {subject.title}
            </option>
          </div>
        ))}
      </select>

      <button>Add Content Question</button>
    </form>
  );
};

export default Subjects;

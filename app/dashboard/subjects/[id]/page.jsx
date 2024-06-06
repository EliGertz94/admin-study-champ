import { getAllQuestions } from "@/logic/questions/questionsLogic";
import { fetchSubject, updateSubject } from "@/logic/subject/subjectLogic";
import styles from "@/ui/dashboard/users/singleUser/singleUser.module.css";
import SelectComp from "@/ui/select/select";

const SingleUserPage = async ({ params }) => {
  const { id } = params;
  const subject = await fetchSubject(id);
  const questions = await getAllQuestions();
  // Ensure questions are plain objects
  const serializedQuestions = questions.map((question) => ({
    _id: question._id.toString(),
    text: question.text,
    course: question.course ? question.course.toString() : null,
    // Add any other necessary fields here
  }));
  const initialSelectedQuestions = subject.questions.map((question) => ({
    _id: question._id.toString(),
    text: question.text,
    course: question.course ? question.course.toString() : null,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form action={updateSubject} className={styles.form}>
          <input id="id" type="hidden" name="id" value={subject.id} />

          <label>title</label>
          <input type="text" name="title" placeholder={subject.title} />
          <label>content</label>
          <textarea type="text" name="content" placeholder={subject.content} />
          {/* add questions fetching  */}
          <SelectComp
            questions={serializedQuestions}
            initialSelectedQuestions={initialSelectedQuestions}
          />

          <button>Update</button>
        </form>
      </div>
    </div>
  );
};

export default SingleUserPage;

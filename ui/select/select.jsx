"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";

const SelectComp = ({ questions, initialSelectedQuestions }) => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    console.log(selectedQuestions);
  }, [selectedQuestions]);

  useEffect(() => {
    if (initialSelectedQuestions) {
      const initialQuestionIds = initialSelectedQuestions.map(
        (question) => question._id
      );
      setSelectedQuestions(initialQuestionIds);
    }
  }, [initialSelectedQuestions]);

  const handleSelectChange = (selectedOptions) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setSelectedQuestions(selectedValues);
  };

  const questionOptions = questions.map((question) => ({
    value: question._id,
    label: question.text,
  }));

  return (
    <div>
      <label>Questions</label>
      <Select
        name="questions" // name attribute to indicate an array
        options={questionOptions}
        onChange={handleSelectChange}
        value={questionOptions.filter((option) =>
          selectedQuestions.includes(option.value)
        )}
        placeholder="Select questions"
        isMulti
      />
      {/* Generate hidden inputs for selected questions */}
      {selectedQuestions.map((questionId) => (
        <input
          key={questionId}
          type="hidden"
          name="questions[]"
          value={questionId}
        />
      ))}
    </div>
  );
};

export default SelectComp;

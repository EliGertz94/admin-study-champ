import React, { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MathJax from "mathjax";

const MathEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    MathJax.typesetPromise([document.getElementById("math-content")]).catch(
      (err) => console.error(err)
    );
  }, [value]);

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["formula"],
          ],
        }}
        formats={[
          "header",
          "bold",
          "italic",
          "underline",
          "list",
          "bullet",
          "link",
          "image",
          "formula",
        ]}
      />
      <div id="math-content" dangerouslySetInnerHTML={{ __html: value }}></div>
    </div>
  );
};

export default MathEditor;

import React, { useEffect } from "react";
import MathJax from "mathjax";

const MathJaxRenderer = ({ content }) => {
  useEffect(() => {
    MathJax.typesetPromise([document.getElementById("math-content")]).catch(
      (err) => console.log(err)
    );
  }, [content]);

  return (
    <div id="math-content" dangerouslySetInnerHTML={{ __html: content }}></div>
  );
};

export default MathJaxRenderer;

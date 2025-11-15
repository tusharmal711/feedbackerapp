import React, { useState } from "react";
import "./../../CSS/index.css";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { FaWpforms } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
const backendUrl = process.env.REACT_APP_BACKEND_URL; 
const CreateForm = () => {
  const [formData, setFormData] = useState({
  emailId: "",
  formTitle: "",
  courseName: "",
  semester: "",
  description: "",
});
const emailId = sessionStorage.getItem("emailId") || 
                  localStorage.getItem("emailId") ||  
                  Cookies.get("teacherEmail");
useEffect(() => {
  

  if (emailId) {
   
    setFormData((prev) => ({ ...prev, emailId }));
   
  }
}, []);

  const [questions, setQuestions] = useState([
    { questionText: "", questionType: "text", options: [] },
  ]);

  const [previewMode, setPreviewMode] = useState(false);
  const [message, setMessage] = useState("");

  // Handle base form field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle question input
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  // Add new question
  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", questionType: "text", options: [] }]);
  };

  // Add option for MCQ/Dropdown
  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  // Handle option change
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // Preview mode
  const handlePreview = () => {
    setPreviewMode(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${backendUrl}teacher/createForm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, emailId , questions }),
      });

      if (!response.ok) throw new Error("Failed to create form");
      const result = await response.json();

      setMessage("✅ Form created successfully!");
      setFormData({ teacherId: "6734567abc123", formTitle: "", courseName: "", semester: "", description: "" });
      setQuestions([{ questionText: "", questionType: "text", options: [] }]);
      setPreviewMode(false);

      console.log(result);
    } catch (error) {
      console.error(error);
      setMessage("Failed to create form. Please try again.");
    }
  };

  return (
    <div className="create-container">
    <div className="create-form-container">
      <div className="form-header">
        <h2>Create New Feedback Form <FaWpforms /></h2>
        <p>Fill out details and add questions below.</p>
      </div>

      {!previewMode ? (
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Form Title</label>
            <input name="formTitle" value={formData.formTitle} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Course Name</label>
            <input name="courseName" value={formData.courseName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Semester</label>
            <select name="semester" value={formData.semester} onChange={handleChange} required>
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6].map((n) => (
                <option key={n} value={`${n}`}>Semester {n}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </div>

          <h3>Questions</h3>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="question-box">
              <input
                type="text"
                placeholder="Enter question"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                required
              />

              <select
                value={q.questionType}
                onChange={(e) => handleQuestionChange(qIndex, "questionType", e.target.value)}
              >
                <option value="text">Text</option>
                <option value="mcq">MCQ</option>
                <option value="dropdown">Dropdown</option>
              </select>

              {(q.questionType === "mcq" || q.questionType === "dropdown") && (
                <div className="options">
                  <h4>Options:</h4>
                  {q.options.map((opt, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      value={opt}
                      placeholder={`Option ${optIndex + 1}`}
                      onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    />
                  ))}
                  <button type="button" onClick={() => addOption(qIndex)}>➕ Add Option</button>
                </div>
              )}
            </div>
          ))}

          <button type="button" onClick={addQuestion}><FaPlus /> Add Question</button>
          <button type="button" onClick={handlePreview}><FaRegEye /> Preview</button>
          <button type="submit">✔ Submit</button>

          {message && <p className="success-message">{message}</p>}
        </form>
      ) : (
        <div className="preview-section">
          <h2>👁 Form Preview</h2>
          <h3>{formData.formTitle}</h3>
          <p>{formData.description}</p>

          {questions.map((q, i) => (
            <div key={i} className="preview-question">
              <p><b>Q{i + 1}:</b> {q.questionText}</p>
              {q.questionType === "text" && <input type="text" placeholder="Answer here..." />}
              {q.questionType === "mcq" &&
                q.options.map((opt, j) => (
                  <div key={j}>
                    <input type="radio" name={`q${i}`} /> {opt}
                  </div>
                ))}
              {q.questionType === "dropdown" && (
                <select>
                  {q.options.map((opt, j) => (
                    <option key={j}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <button onClick={() => setPreviewMode(false)}>✏ Edit</button>
          <button onClick={handleSubmit} className="confirm">✔ Confirm & Submit</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default CreateForm;

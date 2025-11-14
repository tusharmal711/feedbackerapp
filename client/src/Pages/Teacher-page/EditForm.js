import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const backendUrl = process.env.REACT_APP_BACKEND_URL; 
const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    formTitle: "",
    courseName: "",
    semester: "",
    description: "",
  });
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch existing form
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`${backendUrl}teacher/form/${id}`);
        const data = await res.json();

        if (res.ok) {
          setFormData({
            formTitle: data.formTitle || "",
            courseName: data.courseName || "",
            semester: data.semester || "",
            description: data.description || "",
          });
          setQuestions(data.questions || []);
        } else {
          setMessage(data.message || "Form not found");
        }
      } catch (error) {
        console.error("Error fetching form:", error);
        setMessage("Error fetching form data");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle question edit
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", questionType: "text", options: [] },
    ]);
  };

  // ✅ Submit updated form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backendUrl}teacher/updateForm/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, questions }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Update failed");

      setMessage("✅ Form updated successfully!");
      setTimeout(() => navigate("/teacher/viewForms"), 1500);
    } catch (error) {
      console.error("Error updating form:", error);
      setMessage("❌ Failed to update form");
    }
  };

  if (loading) return <p className="loading-text">Loading form...</p>;

  return (
    <div className="edit-container">
      <h2>✏ Edit Feedback Form</h2>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Form Title</label>
          <input
            name="formTitle"
            value={formData.formTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Course Name</label>
          <input
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Semester</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
          >
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={`${n}`}>
                Semester {n}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <h3>📝 Questions</h3>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-box">
            <input
              type="text"
              placeholder="Enter question"
              value={q.questionText}
              onChange={(e) =>
                handleQuestionChange(qIndex, "questionText", e.target.value)
              }
            />
            <select
              value={q.questionType}
              onChange={(e) =>
                handleQuestionChange(qIndex, "questionType", e.target.value)
              }
            >
              <option value="text">Text</option>
              <option value="mcq">MCQ</option>
              <option value="dropdown">Dropdown</option>
            </select>

            {(q.questionType === "mcq" || q.questionType === "dropdown") && (
              <div className="options">
                {q.options.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    value={opt}
                    placeholder={`Option ${optIndex + 1}`}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                  />
                ))}
                <button
                  type="button"
                  className="add-option-btn"
                  onClick={() => addOption(qIndex)}
                >
                  ➕ Add Option
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="form-actions">
          <button type="button" onClick={addQuestion} className="add-question-btn">
            ➕ Add Question
          </button>
          <button type="submit" className="save-btn">
            💾 Save Changes
          </button>
        </div>
      </form>

      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default EditForm;

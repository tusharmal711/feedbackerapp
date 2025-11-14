import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TiTickOutline } from "react-icons/ti";
const backendUrl = process.env.REACT_APP_BACKEND_URL; 
const FillFeedbackForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // 🧠 Retrieve student email from session or cookies
  const studentEmail =
    sessionStorage.getItem("studentEmail") ||
    localStorage.getItem("studentEmail") ||
    Cookies.get("studentEmail");

  // 🟢 Fetch form details and check if already submitted
  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const res = await fetch(
          `${backendUrl}feedbackResponse/getForm/${formId}`
        );
        const data = await res.json();

        if (res.ok) setForm(data);
        else toast.error(data.message || "Failed to load form");
      } catch (err) {
        console.error("Error fetching form:", err);
        toast.error("Error fetching form");
      }
    };

    const checkIfSubmitted = async () => {
      try {
        const res = await fetch(
          `${backendUrl}feedbackResponse/checkIfSubmitted?formId=${formId}&studentEmail=${studentEmail}`
        );
        const data = await res.json();

        if (res.ok && data.submitted) {
          setAlreadySubmitted(true);
        }
      } catch (err) {
        console.error("Error checking submission:", err);
      }
    };

    if (studentEmail) {
      fetchFormDetails();
      checkIfSubmitted();
    } else {
      toast.error("Student not logged in. Please log in again.");
      setLoading(false);
    }

    setLoading(false);
  }, [formId, studentEmail]);

  // 📝 Handle response change
  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // 🚀 Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentEmail) {
      toast.error("Student email not found. Please log in again.");
      return;
    }

    const answers = Object.entries(responses).map(([questionId, response]) => ({
      questionId,
      response,
    }));

    if (answers.length === 0) {
      toast.error("Please answer all questions before submitting!");
      return;
    }

    try {
      const res = await fetch(
        `${backendUrl}feedbackResponse/submitFeedbackResponse`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formId,
            teacherEmail: form?.emailId,
            studentEmail,
            answers,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else if (data.message === "Feedback already submitted for this form") {
        setAlreadySubmitted(true);
      } else {
        toast.error(data.message || "Failed to submit feedback");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      toast.error("Error submitting feedback");
    }
  };

  if (loading) return <p>Loading form...</p>;
  if (!form) return <p>Form not found.</p>;

  return (
    <div className="fill-feedback-container">
      <ToastContainer />

      {/* ✅ Already Submitted Card */}
      {alreadySubmitted ? (
        <div className="success-card already-card">
          <h2><TiTickOutline className="tick"/> Response Already Submitted</h2>
          <p>You’ve already submitted feedback for this form.</p>
          <p>Thank you for your participation.</p>
        </div>
      ) : submitted ? (
        <div className="success-card">
          <h2>🎉 Response Submitted Successfully!</h2>
          <p>Thank you for your valuable feedback.</p>
        </div>
      ) : (
        <>
          <h2>{form.formTitle}</h2>
          <p>
            <strong>Course:</strong> {form.courseName}
          </p>
          <p>
            <strong>Semester:</strong> {form.semester}
          </p>
          <p>
            <strong>Description:</strong> {form.description}
          </p>

          <form onSubmit={handleSubmit}>
            {form.questions?.length > 0 ? (
              form.questions.map((q, index) => (
                <div key={q._id} className="question-block">
                  <label className="question-text">
                    {index + 1}. {q.questionText}
                  </label>

                  {q.questionType === "dropdown" && (
                    <select
                      className="dropdown"
                      value={responses[q._id] || ""}
                      onChange={(e) =>
                        handleResponseChange(q._id, e.target.value)
                      }
                      required
                    >
                      <option value="">Select an option</option>
                      {q.options.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {q.questionType === "mcq" && (
                    <div className="mcq-options">
                      {q.options.map((opt, i) => (
                        <label
                          key={i}
                          className={`mcq-option ${
                            responses[q._id] === opt ? "selected" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name={q._id}
                            value={opt}
                            checked={responses[q._id] === opt}
                            onChange={(e) =>
                              handleResponseChange(q._id, e.target.value)
                            }
                            required
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.questionType === "text" && (
                    <input
                      type="text"
                      className="text-input"
                      placeholder="Your answer"
                      value={responses[q._id] || ""}
                      onChange={(e) =>
                        handleResponseChange(q._id, e.target.value)
                      }
                      required
                    />
                  )}
                </div>
              ))
            ) : (
              <p>No questions available for this form.</p>
            )}

            <button type="submit" className="submit-btn">
              <TiTickOutline className="tick1"/> Submit Feedback
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default FillFeedbackForm;

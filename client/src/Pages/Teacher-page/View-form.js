import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiLink,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiClock,
  FiClipboard,
  FiBarChart2,
} from "react-icons/fi";
const backendUrl = process.env.REACT_APP_BACKEND_URL; 
const ViewForms = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [expandedForm, setExpandedForm] = useState(null);
  const [expandedFormQuestions, setExpandedFormQuestions] = useState({});
  const [copyMsg, setCopyMsg] = useState(""); // ✅ for "link copied" message

  const emailId =
    sessionStorage.getItem("emailId") ||
    localStorage.getItem("emailId") ||
    Cookies.get("teacherEmail");

  // ✅ Fetch all teacher forms
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch(
          `${backendUrl}teacher/teacherForms/${emailId}`
        );
        const data = await res.json();
        setForms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, [emailId]);

  // ✅ Delete a form
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;
    try {
      const res = await fetch(`${backendUrl}teacher/deleteForm/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setForms((prev) => prev.filter((form) => form._id !== id));
        setMessage("Form deleted successfully ✅");
      } else {
        setMessage(data.message || "Failed to delete form");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Error deleting form ❌");
    }
  };

  // ✅ Toggle expand + fetch questions dynamically
  const toggleExpand = async (id) => {
    if (expandedForm === id) {
      setExpandedForm(null);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}teacher/getQuestions/${id}`);
      const data = await res.json();

      if (res.ok) {
        setExpandedForm(id);
        setExpandedFormQuestions((prev) => ({
          ...prev,
          [id]: data.questions || [],
        }));
      } else {
        alert(data.message || "Error fetching form questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // ✅ Copy Link with message
  const handleCopyLink = async (formId) => {
    const link = `${window.location.origin}/student/fill_form/${formId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopyMsg("✅ Link copied!");
      setTimeout(() => setCopyMsg(""), 2000); // remove after 2 sec
    } catch (err) {
      console.error("Failed to copy link:", err);
      setCopyMsg("❌ Failed to copy link");
      setTimeout(() => setCopyMsg(""), 2000);
    }
  };

  // ✅ Format date
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <p>Loading forms...</p>;

  return (
    <div className="view-container">
      <h2 className="header-title flex items-center gap-2 text-2xl font-semibold">
        <FiClipboard /> My Feedback Forms
      </h2>

      {message && <p className="message">{message}</p>}
      {copyMsg && <div className="copy-msg">{copyMsg}</div>} {/* ✅ Copy message */}

      {forms.length === 0 ? (
        <p>No forms created yet.</p>
      ) : (
        <div className="form-list">
          {forms.map((form) => (
            <div key={form._id} className="form-card">
              <div className="form-header">
                <div>
                  <h3 className="font-bold text-lg">{form.formTitle}</h3>
                  <p>
                    <b>Course:</b> {form.courseName}
                  </p>
                  <p>
                    <b>Semester:</b> {form.semester}
                  </p>
                  <p>
                    <b>Description:</b> {form.description}
                  </p>
                  <small className="flex items-center gap-1 text-gray-600">
                    <FiClock /> Created: {formatDate(form.createdAt)}
                  </small>
                </div>

                <div className="actions flex flex-wrap gap-2 mt-3">
                  {/* View */}
                  <button
                    className="btn-icon"
                    onClick={() => toggleExpand(form._id)}
                  >
                    {expandedForm === form._id ? (
                      <>
                        <FiEyeOff /> Hide
                      </>
                    ) : (
                      <>
                        <FiEye /> View
                      </>
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    className="btn-icon"
                    onClick={() => navigate(`/teacher_dashboard/edit/${form._id}`)}
                  >
                    <FiEdit /> Edit
                  </button>

                  {/* ✅ Copy Link */}
                  <button
                    className="btn-icon"
                    onClick={() => handleCopyLink(form._id)}
                  >
                    <FiLink /> Copy Link
                  </button>

                  {/* Responses */}
                  <button
                    className="btn-icon"
                    onClick={() => navigate(`/teacher_dashboard/responses/${form._id}`)}
                  >
                    <FiBarChart2 /> Responses
                  </button>

                  {/* Delete */}
                  <button
                    className="btn-icon delete-btn"
                    onClick={() => handleDelete(form._id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>

              {/* Expand section */}
              {expandedForm === form._id && (
                <div className="question-section">
                  <h4 className="text-md font-semibold mb-2">Questions:</h4>
                  {expandedFormQuestions[form._id]?.length > 0 ? (
                    expandedFormQuestions[form._id].map((q, i) => (
                      <div key={i} className="question-item mb-2">
                        <p>
                          <b>Q{i + 1}:</b> {q.questionText || "Untitled Question"}
                        </p>
                        <p>
                          Type:{" "}
                          <b>
                            {q.questionType
                              ? q.questionType.toUpperCase()
                              : "TEXT"}
                          </b>
                        </p>
                        {q.options && q.options.length > 0 && (
                          <ul className="ml-4 list-disc text-gray-700">
                            {q.options.map((opt, idx) => (
                              <li key={idx}>{opt}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No questions found.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewForms;

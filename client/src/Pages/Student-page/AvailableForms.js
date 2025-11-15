import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaPen } from "react-icons/fa";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AvailableForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Student Email
  const stuEmail =
    sessionStorage.getItem("studentEmail") ||
    localStorage.getItem("studentEmail") ||
    Cookies.get("studentEmail");

  useEffect(() => {
    const fetchForms = async () => {
      try {
        if (!stuEmail) {
          console.error("Student email not found");
          setForms([]);
          setLoading(false);
          return;
        }

        // Fetch available forms
        const res = await fetch(`${backendUrl}feedbackResponse/getAvailableForms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stuEmail }),
        });

        const data = await res.json();

        if (res.ok && data.success && Array.isArray(data.forms)) {
          const formsWithSubmission = await Promise.all(
            data.forms.map(async (form) => {
              // Check submission for each form
              const checkRes = await fetch(
                `${backendUrl}feedbackResponse/checkIfSubmitted?formId=${form._id}&studentEmail=${stuEmail}`
              );

              const checkData = await checkRes.json();

              return {
                ...form,
                isSubmitted: checkData?.submitted || false,
              };
            })
          );

          setForms(formsWithSubmission);
        } else {
          console.error("Error fetching forms:", data.message);
          setForms([]);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
        setForms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [stuEmail]);

  // Format date & time
  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) return <p>Loading available forms...</p>;

  return (
    <div className="available-forms">
      <h2>
        <MdOutlinePendingActions /> Available Feedback Forms
      </h2>

      {forms.length === 0 ? (
        <p>No forms available for your semester/section.</p>
      ) : (
        forms.map((form) => (
          <div key={form._id} className="form-card">
            <h3>{form.formTitle}</h3>
            <p><b>Creator:</b> {form.creator || "Unknown"}</p>
            <p><b>Course:</b> {form.courseName}</p>
            <p><b>Semester:</b> {form.semester}</p>
            <p><b>Description:</b> {form.description || "No description"}</p>
            <p><b>Created On:</b> {formatDateTime(form.createdAt)}</p>

            {form.isSubmitted ? (
              <button disabled className="submitted-btn"style={{ backgroundColor: "green", color: "white" }}>
                ✔ Submitted
              </button>
            ) : (
              <button
                onClick={() => navigate(`/student/fill_form/${form._id}`)}
                className="fill-btn"
              >
                <FaPen /> Fill Form
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AvailableForms;

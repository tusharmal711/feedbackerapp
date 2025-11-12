import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const TeacherForms = () => {
  const emailId = sessionStorage.getItem("emailId") || localStorage.getItem("emailId") || Cookies.get("teacherEmail");
  const [forms, setForms] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (emailId) {
      axios.get(`http://localhost:5000/api/forms/${emailId}`)
        .then((res) => setForms(res.data))
        .catch((err) => console.error("Error fetching forms:", err));
    }
  }, [emailId]);

  const deleteForm = async (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      await axios.delete(`http://localhost:5000/api/forms/${id}`);
      setForms(forms.filter((form) => form._id !== id));
    }
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const copyLink = (id) => {
    const link = `${window.location.origin}/student/form/${id}`;
    navigator.clipboard.writeText(link);
    alert("Form link copied to clipboard!");
  };

  const formatDate = (date) => {
    const created = new Date(date);
    const now = new Date();
    const diffHours = (now - created) / (1000 * 60 * 60);

    if (diffHours < 24) return "Today";
    if (diffHours < 48) return "Yesterday";
    return created.toLocaleDateString();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Your Created Forms</h2>

      {forms.length === 0 ? (
        <p className="text-center text-gray-500">No forms created yet.</p>
      ) : (
        forms.map((form) => (
          <div key={form._id} className="border rounded-lg p-4 mb-4 shadow hover:shadow-lg transition">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-blue-600">
                {form.formTitle || "Untitled Form"}
              </h3>
              <span className="text-sm text-gray-500">{formatDate(form.createdAt)}</span>
            </div>

            <p className="text-gray-600">{form.courseName?.toUpperCase() || "N/A"} — {form.semester}</p>
            <p className="text-gray-700 mb-2">{form.description}</p>

            <div className="flex gap-3">
              <button
                onClick={() => toggleExpand(form._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                {expanded === form._id ? "Hide Questions" : "View Questions"}
              </button>

              <button
                onClick={() => copyLink(form._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Copy Link
              </button>

              <button
                onClick={() => deleteForm(form._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => window.location.href = `/teacher/edit/${form._id}`}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
            </div>

            {expanded === form._id && (
              <div className="mt-4 bg-gray-100 p-3 rounded-lg">
                <h4 className="font-semibold mb-2">Questions:</h4>
                {form.questions?.map((q, idx) => (
                  <div key={idx} className="mb-3 border-b pb-2">
                    <p className="font-medium">{q.questionText}</p>
                    <p className="text-sm text-gray-600">Type: {q.questionType}</p>
                    {q.options && q.options.length > 0 && (
                      <ul className="list-disc list-inside text-gray-700">
                        {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TeacherForms;

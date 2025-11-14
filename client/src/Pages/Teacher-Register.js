import { Link } from "react-router-dom";
import "../CSS/index.css";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const backendUrl = process.env.REACT_APP_BACKEND_URL; 
// Teacher registration form component
export default function TeacherReg() {
  const [teacher, setTeacher] = useState({
    teacherName: "",
    emailId: "",
    college: "",
    deptName: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teacher.teacherName || !teacher.emailId || !teacher.password) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (teacher.password.length < 6) {
      toast.warning("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}teacher/registerTeacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacher),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Teacher registered successfully! Your account will be approved by admin.");

        // reset form
        setTeacher({
          teacherName: "",
          emailId: "",
          college: "",
          deptName: "",
          password: "",
        });
      } else {
        toast.error(data.error || "Error registering teacher!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error registering teacher! (Network or server error)");
    }
  };

  return (
    <div className="main-container">
      <div className="web-logo">
        <img src="./Images/FeedBacker-logo.png" alt="logo" />
        <span className="web-logo-name">FeedBacker</span>
      </div>

      <div className="student-reg-container">
        <h2>Teacher Registration</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="text-field name">
            <label htmlFor="teacherName">Name</label>
            <input
              type="text"
              name="teacherName"
              value={teacher.teacherName}
              onChange={handleChange}
              className="student-name"
              required
            />
          </div>

          {/* Email */}
          <div className="text-field email">
            <label htmlFor="emailId">Email</label>
            <input
              type="email"
              name="emailId"
              value={teacher.emailId}
              onChange={handleChange}
              className="student-email"
              required
            />
          </div>

          {/* College */}
          <div className="text-field roll">
            <label htmlFor="college">College name</label>
            <select name="college" value={teacher.college} onChange={handleChange} required>
              <option value="">Select college</option>
              <option value="Techno Main Salt Lake">Techno Main Salt Lake</option>
              <option value="Techno India University">Techno India University</option>
              <option value="Tehno International Newtown">Tehno International Newtown</option>
            </select>
          </div>

          {/* Department */}
          <div className="text-field">
            <label htmlFor="deptName">Department</label>
            <select name="deptName" value={teacher.deptName} onChange={handleChange} required>
              <option value="">Select department</option>
              <option value="MCA">MCA</option>
              <option value="BCA">BCA</option>
              <option value="BTECH">BTECH</option>
              <option value="BBA">BBA</option>
              <option value="MBA">MBA</option>
              <option value="IT">IT</option>
              <option value="CSE-AI/ML">CSE-AI/ML</option>
              <option value="MTECH">MTECH</option>
            </select>
          </div>

          {/* Password */}
          <div className="text-field password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={teacher.password}
              onChange={handleChange}
              className="student-password"
              required
              minLength={6}
            />
          </div>

          {/* Register Button */}
          <div className="stu-log-btn">
            <button type="submit">Register</button>
          </div>
        </form>

        <p className="not-account-log">
          Already have an account? <Link to="/teacher_login">Login</Link>
        </p>
      </div>

      {/* Toastify container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

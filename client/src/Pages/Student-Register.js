import { Link } from "react-router-dom";
import "../CSS/index.css";
import { useState } from "react";

const StuReg = () => {
  const [student, setStudent] = useState({
    studName: "",
    emailId: "",
    college: "",
    deptName: "",
    uniRoll: "",
    section: "",
    semester: "",
    password: "",
  });

  // handle change
  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/student/registerStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Student registered successfully!");
        console.log(data);

        // reset form
        setStudent({
          studName: "",
          emailId: "",
          college: "",
          deptName: "",
          uniRoll: "",
          section: "",
          semester: "",
          password: "",
        });
      } else {
        alert(data.error || "Error registering student!");
      }
    } catch (err) {
      console.error(err);
      alert("Error registering student!");
    }
  };

  return (
    <div className="main-container">
      <div className="web-logo">
        <img src="./Images/FeedBacker-logo.png" alt="logo" />
        <span className="web-logo-name">FeedBacker</span>
      </div>

      <div className="student-reg-container">
        <h2>Register here</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="text-field name">
            <label htmlFor="studName">Name</label>
            <input
              type="text"
              name="studName"
              value={student.studName}
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
              value={student.emailId}
              onChange={handleChange}
              className="student-email"
              required
            />
          </div>

          {/* College */}
          <div className="text-field roll">
            <label htmlFor="college">College name</label>
            <select
              name="college"
              value={student.college}
              onChange={handleChange}
              required
            >
              <option value="">Select college</option>
              <option value="Techno Main Salt Lake">Techno Main Salt Lake</option>
              <option value="Techno India University">Techno India University</option>
              <option value="Tehno International Newtown">Tehno International Newtown</option>
            </select>
          </div>

          {/* Department */}
          <div className="text-field">
            <label htmlFor="deptName">Department</label>
            <select
              name="deptName"
              value={student.deptName}
              onChange={handleChange}
              required
            >
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

          {/* University Roll */}
          <div className="text-field roll">
            <label htmlFor="uniRoll">University Roll</label>
            <input
              type="text"
              name="uniRoll"
              value={student.uniRoll}
              onChange={handleChange}
              className="student-roll"
              required
            />
          </div>

          {/* Section */}
          <div className="text-field section">
            <label htmlFor="section">Section</label>
            <select
              name="section"
              value={student.section}
              onChange={handleChange}
              required
            >
              <option value="">Select section</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>

          {/* Semester */}
          <div className="text-field section">
            <label htmlFor="semester">Semester</label>
            <select
              name="semester"
              value={student.semester}
              onChange={handleChange}
              required
            >
              <option value="">Select semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>

          {/* Password */}
          <div className="text-field password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={student.password}
              onChange={handleChange}
              className="student-password"
              required
            />
          </div>
          
          {/* Register Button */}
          <div className="stu-log-btn">
            <button type="submit">Register</button>
          </div>
        </form>
        <p className="not-account-log">
          Already have an account?{" "}
          <Link to="/student_login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default StuReg;

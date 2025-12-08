import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../CSS/index.css";
import Cookies from "js-cookie";
const backendUrl = process.env.REACT_APP_BACKEND_URL; 
const TeacherLog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });
const [isLoggingIn, setIsLoggingIn] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  setIsLoggingIn(true);
  e.preventDefault();
  try {
    const res = await fetch(`${backendUrl}teacher/loginTeacher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // allows backend cookie (like JWT)
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok && !data.error) {
      // Save emailId in both sessionStorage and cookie
      sessionStorage.setItem("emailId", formData.emailId);
       localStorage.setItem("emailId", formData.emailId);

      // ✅ Set cookie that expires in 1 day (you can change it)
      Cookies.set("teacherEmail", formData.emailId, {
        expires: 7, // 1 day
        secure: true, // only sent over HTTPS
        sameSite: "Strict",
      });

      // toast.success(data.message || "Login successful!", {
      //   position: "top-right",
      // });

      

      // Redirect after toast
      setTimeout(() => {
        navigate("/teacher_dashboard");
      }, 1500);
    } else {
      toast.error(data.error || data.message || "Invalid credentials", {
        position: "top-right",
      });
    }
  } catch (err) {
    console.error(err);
    toast.error("Error logging in", { position: "top-right" });
  }
};

  return (
    <div className="main-container">
      <div className="web-logo">
        <img src="./Images/FeedBacker-logo.png" alt="logo" />
        <span className="web-logo-name">FeedBacker</span>
      </div>

      <div className="container">
        <h2>Teacher Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="text-field">
            <div>
              <label htmlFor="emailId">Email</label>
            </div>
            <input
              type="email"
              name="emailId"
              id="emailId"
              value={formData.emailId}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="text-field">
            <div>
              <label htmlFor="password">Password</label>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="stu-log-btn">
            <button type="submit" disabled={isLoggingIn}>{isLoggingIn ? "Logging..." : "Login"}</button>
          </div>
        </form>

        <p className="not-account-reg">
          Don’t have an account?{" "}
          <Link to="/teacher_registration">Register</Link>
        </p>
      </div>

      {/* Toastify container */}
      <ToastContainer />
    </div>
  );
};

export default TeacherLog;

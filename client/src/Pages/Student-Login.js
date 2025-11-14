import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../CSS/index.css";
import Cookies from "js-cookie";
const backendUrl = process.env.REACT_APP_BACKEND_URL; 
const StuLog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${backendUrl}student/loginStudent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      toast.success(data.message || "Login successful!", { position: "top-right" });
      console.log("Login response:", data);



       sessionStorage.setItem("studentEmail", formData.emailId);
              localStorage.setItem("studentEmail", formData.emailId);
       
             // ✅ Set cookie that expires in 1 day (you can change it)
             Cookies.set("studentEmail", formData.emailId, {
               expires: 7, // 1 day
               secure: true, // only sent over HTTPS
               sameSite: "Strict",
             });





      setTimeout(() => {
        navigate("/student_dashboard");
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
        <h2>Student Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="text-field">
            <div>
              <label htmlFor="emailId">Email</label>
            </div>
            <input
              type="email"
              name="emailId"
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
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="stu-log-btn">
            <button type="submit">Login</button>
          </div>
        </form>

        <p className="not-account-reg">
          Don’t have an account?{" "}
          <Link to="/student_registration">Register</Link>
        </p>
      </div>

      {/* Toast Container (must be included once) */}
      <ToastContainer />
    </div>
  );
};

export default StuLog;

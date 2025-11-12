import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../CSS/index.css";

const AdminLog = () => {
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
      const res = await fetch("http://localhost:3001/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // allow cookie from backend
        body: JSON.stringify(formData),
      });

      // Backend sometimes sends plain text ("Login Successfully") instead of JSON
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (res.ok && !data.error && text.includes("Login")) {
        toast.success(data.message || "Admin login successful!", {
          position: "top-right",
        });

        console.log("Admin Login response:", data);

        // redirect after toast
        setTimeout(() => {
          navigate("/admin_dashboard");
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
        <h2>Admin Login</h2>
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
      </div>

      {/* Toastify container */}
      <ToastContainer />
    </div>
  );
};

export default AdminLog;

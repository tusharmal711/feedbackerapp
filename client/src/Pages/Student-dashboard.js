import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaPlus, FaUser, FaStar } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";


const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const emailId =
    sessionStorage.getItem("studentEmail") ||
    localStorage.getItem("studentEmail") ||
    Cookies.get("studentEmail");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch("http://localhost:3001/student/fetchStudentData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailId }),
        });
        const result = await response.json();
        setStudentData(result.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    if (emailId) fetchStudentData();
  }, [emailId]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/student/logoutStudent", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      localStorage.removeItem("teacherToken");
      sessionStorage.removeItem("teacherToken");
      Cookies.remove("teacherEmail");
      localStorage.removeItem("emailId");
      sessionStorage.removeItem("emailId");
      navigate("/student_login");

      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.go(1);
      };
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Logout Popup */}
      {showLogout && (
        <div className="admin-logout-container">
          <div className="admin-logout-container-popup">
            <p>Are you sure you want to logout?</p>
            <div className="admin-logout-container-popup-btn">
              <button onClick={() => setShowLogout(false)}>Cancel</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Hamburger for mobile */}
      <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <GiHamburgerMenu />
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <h2 className="logo">🎓 FeedBacker</h2>
        <p className="panel">Student Panel</p>

        <ul className="menu">
          <li
            className={location.pathname === "/student_dashboard" ? "active" : ""}
            onClick={() => {
              navigate("/student_dashboard");
              setIsMenuOpen(false);
            }}
          >
            <BiSolidDashboard /> Dashboard
          </li>

          <li
            className={location.pathname.startsWith("/student_dashboard/student_form") ? "active" : ""}
            onClick={() => {
              navigate("student_form");
              setIsMenuOpen(false);
            }}
          >
            <FaPlus /> Form
          </li>

          <li
            className={location.pathname.startsWith("/student_dashboard/student_profile") ? "active" : ""}
            onClick={() => {
              navigate("student_profile");
              setIsMenuOpen(false);
            }}
          >
            <FaUser /> Profile
          </li>

          <li onClick={() => setShowLogout(true)}>
            <RiLogoutBoxRFill /> Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {location.pathname === "/student_dashboard" ? (
          <>
            <div className="welcome-card">
              {studentData && <h2>Welcome, Dear. {studentData.studName} 👋</h2>}
              <p>Here’s a summary of your recent feedback performance.</p>
            </div>

            <div className="stats">
              <div className="stat-card">
                <p>Total Forms</p>
                <h3>12</h3>
              </div>
              <div className="stat-card">
                <p>Total Submitted</p>
                <h3>245</h3>
              </div>
              <div className="stat-card">
                <p>Avg. Rating</p>
                <h3>
                  4.4 <FaStar className="rating" />
                </h3>
              </div>
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;

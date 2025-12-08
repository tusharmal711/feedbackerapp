import React, { useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
const backendUrl = process.env.REACT_APP_BACKEND_URL; 
const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);   // For sidebar open/close
  const [showLogout, setShowLogout] = useState(false);
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };
  // ------------------ LOGOUT ------------------
  const handleLogout = async () => {
    try {
      const res = await fetch(`${backendUrl}admin/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminToken");
        navigate("/");

        // window.history.pushState(null, "", window.location.href);
        // window.onpopstate = function () {
        //   window.history.go(1);
        // };
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="dashboard-container">

      {/* LOGOUT POPUP */}
      {showLogout && (
        <div className="admin-logout-container">
          <div className="admin-logout-container-popup">
            <p>Are you sure to logout ?</p>
            <div className="admin-logout-container-popup-btn">
              <button onClick={() => setShowLogout(false)}>Cancel</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* HAMBURGER (Mobile) */}
      <div
        className={`hamburger ${isOpen ? "hamburgerBackground" : ""}`}
        onClick={toggleSidebar}
      >
         <div className="web-logo-dashboard-mobile">
        <img src="/Images/FeedBacker-logo.png" alt="logo" />
        <span className="web-logo-name">FeedBacker</span>
      </div>
        <GiHamburgerMenu className="ham-icon"/>
      </div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${isOpen ? "showNavbar" : ""}`} id="sidebar">
         <div className="web-logo-dashboard">
        <img src="/Images/FeedBacker-logo.png" alt="logo" />
        <span className="web-logo-name">FeedBacker</span>
      </div>

        {/* ADMIN PROFILE */}
        <div className="admin-profile">
          <img src="/Images/image.png" alt="not-found" />
          <div className="admin-profile-text">
            <p>Admin</p>
            <p>admin@gmail.com</p>
          </div>
        </div>

        {/* MENU */}
        <ul className="menu">

          <li
            className={
              location.pathname.includes("approve_teacher") ? "active" : ""
            }
            onClick={() => {
              navigate("approve_teacher");
              setIsOpen(false);
            }}
          >
            Pending Teacher <FaChevronRight className="admin-left-arrow" />
          </li>

          <li
            className={
              location.pathname.includes("approve_student") ? "active" : ""
            }
            onClick={() => {
              navigate("approve_student");
              setIsOpen(false);
            }}
          >
            Pending Student <FaChevronRight className="admin-left-arrow" />
          </li>

          <li
            className={
              location.pathname.includes("approved_teacher") ? "active" : ""
            }
            onClick={() => {
              navigate("approved_teacher");
              setIsOpen(false);
            }}
          >
            Approved Teacher <FaChevronRight className="admin-left-arrow" />
          </li>

          <li
            className={
              location.pathname.includes("approved_student") ? "active" : ""
            }
            onClick={() => {
              navigate("approved_student");
              setIsOpen(false);
            }}
          >
            Approved Student <FaChevronRight className="admin-left-arrow" />
          </li>

          <li
            onClick={() => {
              setShowLogout(true);
              setIsOpen(false);
            }}
          >
            <IoLogOut size={21} /> Logout
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;

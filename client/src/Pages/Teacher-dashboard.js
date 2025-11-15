import React, { useEffect, useState } from "react";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaPlus, FaUser, FaStar } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { VscPreview } from "react-icons/vsc";
import { GiHamburgerMenu } from "react-icons/gi";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { IoLogOut } from "react-icons/io5";

const backendUrl = process.env.REACT_APP_BACKEND_URL; 
const TeacherDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [teacherData, setTeacherData] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 const [imagePreview, setImagePreview] = useState(null);
  const emailId =
    sessionStorage.getItem("emailId") ||
    localStorage.getItem("emailId") ||
    Cookies.get("teacherEmail");

  // Toggle sidebar using React state
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };



const [formCount,setFormCount]=useState(0);
const [responseCount,setResponseCount]=useState(0);
useEffect(() => {
  const getFormCount = async () => {
    try {
      const response = await fetch(`${backendUrl}teacher/countNumberOfForm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId }),
      });

      const result = await response.json();
      console.log("Total documents:", result.count);
      setFormCount(result.count);
    } catch (error) {
      console.error("Error fetching count:", error);
    }
  };

  if (emailId) {
    getFormCount();
  }
  
}, [emailId]);


useEffect(() => {
  const getResponseCount = async () => {
    try {
      const response = await fetch(`${backendUrl}teacher/countNumberOfResponse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId }),
      });

      const result = await response.json();
      console.log("Total documents:", result.count);
      setResponseCount(result.count);
    } catch (error) {
      console.error("Error fetching count:", error);
    }
  };

  if (emailId) {
    getResponseCount();
  }
  
}, [emailId]);



  //Fetch teacher data
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch(`${backendUrl}teacher/fetchTeacherData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailId }),
        });

        const result = await response.json();
        console.log("API response:", result);
        setTeacherData(result.data);
        setImagePreview(result.data?.profilePic);
       
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };


    







    if (emailId) {
      console.log("Email ID being sent:", emailId);
      fetchTeacherData();
        const interval = setInterval(fetchTeacherData, 1000);

  // Cleanup interval on unmount
         return () => clearInterval(interval);
    } else {
      console.warn("No emailId found in sessionStorage");
    }
  }, [emailId]);

  //Logout function
  const handleLogout = async () => {
    try {
      await fetch(`${backendUrl}teacher/logoutTeacher`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      localStorage.removeItem("teacherToken");
      sessionStorage.removeItem("teacherToken");
      Cookies.remove("teacherEmail");
      localStorage.removeItem("emailId");
      sessionStorage.removeItem("emailId");
      navigate("/");

      // Prevent back navigation
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
            <p>Are you sure to logout ?</p>
            <div className="admin-logout-container-popup-btn">
              <button onClick={() => setShowLogout(false)}>Cancel</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Hamburger */}
      <div
        className={`hamburger ${isSidebarOpen ? "hamburgerBackground" : ""}`}
        onClick={toggleSidebar}
      >
        <div className="web-logo-dashboard-mobile">
        <img src="/Images/FeedBacker-logo.png" alt="logo" />
        <span className="web-logo-name">FeedBacker</span>
      </div>
        <GiHamburgerMenu className="ham-icon"/>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "showNavbar" : ""}`}>
         <div className="web-logo-dashboard">
        <img src="/Images/FeedBacker-logo.png" alt="logo" />
        <span className="web-logo-name">FeedBacker</span>
      </div>

          <div className="profile-email">
          <img
              src={
                imagePreview || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile Avatar"
              className="teacher-dashboard-profile-img"
            />

            <p>
              {teacherData?.emailId}
            </p>
            </div> 





        <ul className="menu">
          <li
            className={location.pathname === "/teacher_dashboard" ? "active" : ""}
            onClick={() => {
              navigate("/teacher_dashboard");
              setIsSidebarOpen(false);
            }}
          >
            <BiSolidDashboard /> Dashboard
          </li>

          <li
            className={location.pathname === "/teacher_dashboard/create_form" ? "active" : ""}
            onClick={() => {
              navigate("create_form");
              setIsSidebarOpen(false);
            }}
          >
            <FaPlus /> Create Form
          </li>

          <li
            className={location.pathname === "/teacher_dashboard/view_form" ? "active" : ""}
            onClick={() => {
              navigate("view_form");
              setIsSidebarOpen(false);
            }}
          >
            <VscPreview /> View Form
          </li>

          <li
            className={location.pathname === "/teacher_dashboard/teacher_profile" ? "active" : ""}
            onClick={() => {
              navigate("teacher_profile");
              setIsSidebarOpen(false);
            }}
          >
            <FaUser /> Profile
          </li>

          <li
            onClick={() => {
              setShowLogout(true);
              setIsSidebarOpen(false);
            }}
          >
            <IoLogOut size={21} /> Logout
          </li>
        </ul>
      </aside>

      {/* Overlay (click to close) */}
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      {/* Main Content */}
      <main className="main-content">
        {location.pathname === "/teacher_dashboard" ? (
          <>
            <div className="welcome-card">
              {teacherData && <h2>Welcome, Prof. {teacherData.teacherName} 👋</h2>}
              <p>Here’s a summary of your recent feedback performance.</p>
            </div>

            <div className="stats">
              <div className="stat-card">
                <p>Total Forms</p>
                <h3>{formCount}</h3>
              </div>
              <div className="stat-card">
                <p>Total Responses</p>
                <h3>{responseCount}</h3>
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

export default TeacherDashboard;

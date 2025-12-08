import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaPlus, FaUser, FaStar } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoLogOut } from "react-icons/io5";
const backendUrl = process.env.REACT_APP_BACKEND_URL; 
const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [imagePreview, setImagePreview] = useState(null);
 const [isLoggingOut, setIsLoggingOut] = useState(false);
  const emailId =
    sessionStorage.getItem("studentEmail") ||
    localStorage.getItem("studentEmail") ||
    Cookies.get("studentEmail");
      const stuEmail =
    sessionStorage.getItem("studentEmail") ||
    localStorage.getItem("studentEmail") ||
    Cookies.get("studentEmail");
  const toggleSidebar = () => {
    setIsMenuOpen((prev) => !prev);
  };
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`${backendUrl}student/fetchStudentData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailId }),
        });
        const result = await response.json();
        setStudentData(result.data);
         setImagePreview(result.data?.profilePic);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    if (emailId) fetchStudentData();
    const interval = setInterval(fetchStudentData, 1000);

  // Cleanup interval on unmount
         return () => clearInterval(interval);
  }, [emailId]);




const [formCount,setFormCount]=useState(0);
 useEffect(() => {
     const fetchFormsCount = async () => {
       try {
         if (!stuEmail) {
           console.error("Student email not found");
           
           return;
         }
 
         // Fetch available forms
         const res = await fetch(`${backendUrl}feedbackResponse/getAvailableForms`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ stuEmail }),
         });
 
         const data = await res.json();
        setFormCount(data.count);
      } catch (error) {
        console.error("Error fetching forms:", error);
       
      } 
    };

    fetchFormsCount();
  }, [stuEmail]);


const [responseCount,setResponseCount]=useState(0);
useEffect(() => {
  const getResponseCount = async () => {
    try {
      const response = await fetch(`${backendUrl}feedbackResponse/countStudentResponse`, {
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






  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch(`${backendUrl}student/logoutStudent`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      localStorage.removeItem("studentToken");
      sessionStorage.removeItem("studentToken");
      Cookies.remove("studentEmail");
      localStorage.removeItem("emailId");
      sessionStorage.removeItem("emailId");
      navigate("/");

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
              <button onClick={handleLogout}disabled={isLoggingOut}>{isLoggingOut ? "Logging out..." : "Logout"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Hamburger for mobile */}
       <div
        className={`hamburger ${isMenuOpen ? "hamburgerBackground" : ""}`}
        onClick={toggleSidebar}
      >
         <div className="web-logo-dashboard-mobile">
        <img src="/Images/FeedBacker-logo.png" alt="logo" />
        <span className="web-logo-name">FeedBacker</span>
      </div>
    <GiHamburgerMenu className="ham-icon"/>
         </div>
      {/* Sidebar */}
      <aside className={`sidebar ${isMenuOpen ? "showNavbar" : ""}`}>
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
              {studentData?.emailId}
            </p>
            </div> 


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

          <li onClick={() => {setShowLogout(true);
            setIsMenuOpen(false);
          }}
          >
            <IoLogOut size={21} /> Logout
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
                <h3>{formCount}</h3>
              </div>
              <div className="stat-card">
                <p>Total Submitted</p>
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

export default StudentDashboard;

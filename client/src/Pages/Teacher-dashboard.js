import React from "react";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaPlus, FaChartBar, FaUser, FaCog, FaTable } from "react-icons/fa";
import { useEffect,useState } from "react";
import { useLocation ,useNavigate , Outlet} from "react-router-dom";
import { Link } from "react-router-dom";
import { BiSolidDashboard } from "react-icons/bi";
import Cookies from "js-cookie";
import { VscPreview } from "react-icons/vsc";
import { FaStar } from "react-icons/fa";
const TeacherDashboard = () => {


const location=useLocation();
const navigate=useNavigate();
const [viewSection,setViewSection]=useState(2);


const [teacherData,setTeacherData]=useState(null);

const emailId= sessionStorage.getItem("emailId") || localStorage.getItem("emailId") ||  Cookies.get("teacherEmail");

// useEffect(() => {
//     // Fetch teacher data from backend
//     const fetchTeacherData = async () => {
//       try {
//         const response = await fetch("http://localhost:3001/teacher/fetchTeacherData", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ emailId }), // Replace dynamically if needed
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch teacher data");
//         }

//         const result = await response.json();
//         setTeacherData(result.data);
//         console.log(teacherData);
//       } catch (error) {
//         console.error("Error fetching teacher data:", error);
//       } 
//     };

//     fetchTeacherData();
//   }, [emailId]); // Runs once on component mount

// useEffect(() => {
//   const fetchTeacherData = async () => {
//     try {
//       const response = await fetch("http://localhost:3001/teacher/fetchTeacherData", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ emailId }),
//       });
//       const result = await response.json();
//       console.log("Fetched teacher data:", result);
//       setTeacherData(result.data);  // adjust this if API shape differs
//     } catch (error) {
//       console.error("Error fetching teacher data:", error);
//     }
//   };

//   if (emailId) fetchTeacherData();
// }, [emailId]);

useEffect(() => {
  const fetchTeacherData = async () => {
    try {
      const response = await fetch("http://localhost:3001/teacher/fetchTeacherData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailId }),
      });

      const result = await response.json();
      console.log("API response:", result);  // <--- add this
      setTeacherData(result.data);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
  };

  if (emailId) {
    console.log("Email ID being sent:", emailId);  // <--- add this
    fetchTeacherData();
  } else {
    console.warn("No emailId found in sessionStorage");
  }
}, [emailId]);



const [showLogout,setShowLogout]=useState(false);
 const handleLogout = async () => {
  try {
    await fetch("http://localhost:3001/teacher/logoutTeacher", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    localStorage.removeItem("teacherToken");
    sessionStorage.removeItem("teacherToken");
    Cookies.remove("teacherEmail");
     localStorage.removeItem("emailId");
    sessionStorage.removeItem("emailId");
    navigate("/teacher_login");

    // Stop user from going back
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


       {
              showLogout &&(
                   <div className="admin-logout-container">
              <div className="admin-logout-container-popup">
                   
                       <p>Are you sure to logout ?</p>
                     <div className="admin-logout-container-popup-btn">
                      <button onClick={()=>setShowLogout(false)}>Cancel</button>
                      <button onClick={handleLogout}>Logout</button>
                     </div>
                  
                    
              </div>
            </div>
              )
      }


      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">🎓 FeedBacker</h2>
        <p className="panel">Teacher Panel</p>

        <ul className="menu">
  <li
    className={location.pathname === "/teacher_dashboard" ? "active" : ""}
    onClick={() => navigate("/teacher_dashboard")}
  >
    <BiSolidDashboard /> Dashboard
  </li>

  <li
    className={location.pathname === "/teacher_dashboard/create_form" ? "active" : ""}
    onClick={() => navigate("create_form")}
  >
    <FaPlus /> Create Form
  </li>

  <li
    className={location.pathname === "/teacher_dashboard/view_form" ? "active" : ""}
    onClick={() => navigate("view_form")}
  >
    <VscPreview /> View Form
  </li>

  <li
    className={location.pathname === "/teacher_dashboard/teacher_profile" ? "active" : ""}
    onClick={() => navigate("teacher_profile")}
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
      {/* Show Dashboard Summary only on /teacher_dashboard */}
      {location.pathname === "/teacher_dashboard" ? (
        <>
          <div className="welcome-card">
            {teacherData && (
              <h2>Welcome, Prof. {teacherData.teacherName} 👋</h2>
            )}
            <p>Here’s a summary of your recent feedback performance.</p>
          </div>

          <div className="stats">
            <div className="stat-card">
              <p>Total Forms</p>
              <h3>12</h3>
            </div>
            <div className="stat-card">
              <p>Total Responses</p>
              <h3>245</h3>
            </div>
            <div className="stat-card">
              <p>Avg. Rating</p>
              <h3>4.4 <FaStar className="rating"/></h3>
            </div>
          </div>
        </>
      ) : (
        // Otherwise render child page
        <Outlet />
      )}
      </main>

    </div>
  );
};

export default TeacherDashboard;
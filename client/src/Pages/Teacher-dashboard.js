import React, { useEffect, useState } from "react";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaPlus, FaUser, FaStar } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { VscPreview } from "react-icons/vsc";
import { GiHamburgerMenu } from "react-icons/gi";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { IoLogOut } from "react-icons/io5";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Users, FileText, MessageSquare } from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL; 

const TeacherDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [teacherData, setTeacherData] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const emailId =
    sessionStorage.getItem("emailId") ||
    localStorage.getItem("emailId") ||
    Cookies.get("teacherEmail");

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const [formCount, setFormCount] = useState(0);
  const [responseCount, setResponseCount] = useState(0);

  // Sample analytics data
  const weeklyData = [
    { day: "Mon", responses: 12, forms: 2 },
    { day: "Tue", responses: 19, forms: 3 },
    { day: "Wed", responses: 15, forms: 2 },
    { day: "Thu", responses: 25, forms: 4 },
    { day: "Fri", responses: 22, forms: 3 },
    { day: "Sat", responses: 8, forms: 1 },
    { day: "Sun", responses: 5, forms: 1 },
  ];

  const monthlyData = [
    { month: "Jan", responses: 120 },
    { month: "Feb", responses: 150 },
    { month: "Mar", responses: 180 },
    { month: "Apr", responses: 200 },
    { month: "May", responses: 250 },
    { month: "Jun", responses: 280 },
  ];

  useEffect(() => {
    const getFormCount = async () => {
      try {
        const response = await fetch(`${backendUrl}teacher/countNumberOfForm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailId }),
        });
        const result = await response.json();
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
        setResponseCount(result.count);
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    };

    if (emailId) {
      getResponseCount();
    }
  }, [emailId]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch(`${backendUrl}teacher/fetchTeacherData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailId }),
        });
        const result = await response.json();
        setTeacherData(result.data);
        setImagePreview(result.data?.profilePic);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    if (emailId) {
      fetchTeacherData();
      const interval = setInterval(fetchTeacherData, 1000);
      return () => clearInterval(interval);
    }
  }, [emailId]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
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

      // window.history.pushState(null, "", window.location.href);
      // window.onpopstate = function () {
      //   window.history.go(1);
      // };
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="dashboard-container">
      {showLogout && (
        <div className="admin-logout-container">
          <div className="admin-logout-container-popup">
            <p>Are you sure to logout ?</p>
            <div className="admin-logout-container-popup-btn">
              <button onClick={() => setShowLogout(false)}>Cancel</button>
              <button onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`hamburger ${isSidebarOpen ? "hamburgerBackground" : ""}`}
        onClick={toggleSidebar}
      >
        <div className="web-logo-dashboard-mobile">
          <img src="/Images/FeedBacker-logo.png" alt="logo" />
          <span className="web-logo-name">FeedBacker</span>
        </div>
        <GiHamburgerMenu className="ham-icon" />
      </div>

      <aside className={`sidebar ${isSidebarOpen ? "showNavbar" : ""}`}>
        <div className="web-logo-dashboard">
          <img src="/Images/FeedBacker-logo.png" alt="logo" />
          <span className="web-logo-name">FeedBacker</span>
        </div>

        <div className="profile-email">
          <img
            src={imagePreview || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt="Profile Avatar"
            className="teacher-dashboard-profile-img"
          />
          <p>{teacherData?.emailId}</p>
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

      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      <main className="main-content">
        {location.pathname === "/teacher_dashboard" ? (
          <>
            <div className="welcome-card">
              {teacherData && <h2>Welcome, Prof. {teacherData.teacherName} 👋</h2>}
              <p>Here's a summary of your recent feedback performance.</p>
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

            {/* Data Analytics Glass Section */}
            <div className="analytics-section">
              <div className="analytics-header">
                <h2 className="analytics-title">
                  <TrendingUp className="title-icon" />
                  Analytics Overview
                </h2>
                <p className="analytics-subtitle">Track your feedback performance over time</p>
              </div>

              <div className="analytics-grid">
                {/* Weekly Activity Chart */}
                <div className="glass-card large-card">
                  <div className="card-header">
                    <h3 className="card-title">Weekly Activity</h3>
                    <span className="card-badge">Last 7 Days</span>
                  </div>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={weeklyData}>
                        <defs>
                          <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorForms" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
                        <YAxis stroke="rgba(255,255,255,0.6)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(17, 24, 39, 0.95)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="responses"
                          stroke="#6366f1"
                          fillOpacity={1}
                          fill="url(#colorResponses)"
                        />
                        <Area
                          type="monotone"
                          dataKey="forms"
                          stroke="#ec4899"
                          fillOpacity={1}
                          fill="url(#colorForms)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span className="legend-dot responses"></span>
                      <span>Responses</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot forms"></span>
                      <span>Forms Created</span>
                    </div>
                  </div>
                </div>

                {/* Monthly Trends */}
                <div className="glass-card medium-card">
                  <div className="card-header">
                    <h3 className="card-title">Monthly Trends</h3>
                    <span className="card-badge">6 Months</span>
                  </div>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                        <YAxis stroke="rgba(255,255,255,0.6)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(17, 24, 39, 0.95)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                        <Bar dataKey="responses" fill="#10b981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Stats Cards */}
                <div className="glass-card small-card">
                  <div className="stat-icon-wrapper purple">
                    <Users className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Active Students</p>
                    <h4 className="stat-value">156</h4>
                    <span className="stat-change positive">+12% this week</span>
                  </div>
                </div>

                <div className="glass-card small-card">
                  <div className="stat-icon-wrapper blue">
                    <FileText className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Pending Reviews</p>
                    <h4 className="stat-value">23</h4>
                    <span className="stat-change neutral">5 due today</span>
                  </div>
                </div>

                <div className="glass-card small-card">
                  <div className="stat-icon-wrapper green">
                    <MessageSquare className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Avg Response Time</p>
                    <h4 className="stat-value">2.4h</h4>
                    <span className="stat-change positive">-15% faster</span>
                  </div>
                </div>
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
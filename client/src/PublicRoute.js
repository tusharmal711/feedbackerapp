// src/PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = ({children}) => {
  // check cookie
  const teacherCookie = Cookies.get("teacherEmail");

  if (teacherCookie) {
    // if cookie exists, redirect teacher
    return <Navigate to="/teacher_dashboard" replace />;
  }

  // if no cookie, show login page
  return children;
};

export default PublicRoute;

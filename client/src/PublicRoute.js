// src/PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = ({ children }) => {
  // Check if teacher or student is logged in via cookies
  const teacherCookie = Cookies.get("teacherEmail");
  const studentCookie = Cookies.get("studentEmail");
console.log(studentCookie);
  // If teacher is logged in, redirect to teacher dashboard
  if (teacherCookie) {
    return <Navigate to="/teacher_dashboard" replace />;
  }

  // If student is logged in, redirect to student dashboard
  if (studentCookie) {
    return <Navigate to="/student_dashboard" replace />;
  }

  // If no cookies exist, allow access to public page (login/registration)
  return children;
};

export default PublicRoute;

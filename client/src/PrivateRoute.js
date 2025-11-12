// src/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  // get token depending on role
  const token =
    role === "teacher"
      ? localStorage.getItem("teacherToken")
      : role === "student"
      ? localStorage.getItem("studentToken")
      : role === "admin"
      ? localStorage.getItem("adminToken")
      : null;

  // if no token, redirect to login
  if (!token) {
    const redirectPath =
      role === "teacher"
        ? "/teacher_login"
        : role === "student"
        ? "/student_login"
        : role === "admin"
        ? "/admin_login"
        : "/";
    return <Navigate to={redirectPath} replace />;
  }

  // if logged in, show the page
  return children;
};

export default PrivateRoute;

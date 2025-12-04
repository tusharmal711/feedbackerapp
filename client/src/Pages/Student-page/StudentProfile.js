import React, { useEffect, useState } from "react";
import "./../../CSS/index.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaSchool } from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
const backendUrl = process.env.REACT_APP_BACKEND_URL; 
const StudentProfile = () => {
  const [studentData, setStudentData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const emailId =
    sessionStorage.getItem("studentEmail") ||
    localStorage.getItem("studentEmail") ||
    Cookies.get("studentEmail");

  // ✅ Fetch student data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${backendUrl}student/fetchStudentData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailId }),
        });
        const result = await res.json();
        setStudentData(result.data);
        setImagePreview(result.data?.profilePic);
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    };
    fetchData();
    //  const interval = setInterval(fetchData, 1000);

  // Cleanup interval on unmount
        //  return () => clearInterval(interval);
  }, [emailId]);

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  // ✅ Update profile details
  const handleSave = async () => {
    try {
      const res = await fetch(`${backendUrl}student/updateStudent`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      const result = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
        setEditMode(false);
        setStudentData(result.data);
      } else {
        toast.error(result.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    }
  };

  //  Upload new profile picture
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file)); // Show preview instantly

    const formData = new FormData();
     formData.append("dp", file);
    formData.append("emailId", emailId);

    try {
      const res = await fetch(`${backendUrl}student/changeStudentDp`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Profile picture updated!");
        
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading image");
    }
  };

  if (!studentData) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <label htmlFor="upload-photo">
             <img
              src={
                imagePreview || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile Avatar"
              className="profile-avatar"
            />
            <input
              type="file"
              id="upload-photo"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
          <p className="change-photo-text">Click to change photo</p>
        </div>

        <div className="profile-info">
          <h2>{studentData.studName}</h2>
          <p><MdEmail /> {studentData.emailId}</p>
          <p><FaSchool /> {studentData.college}</p>
          <p><IoSchool /> {studentData.deptName}</p>
        </div>

        <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="profile-details">
        <h3>Personal Information</h3>
        <div className="profile-grid">
          <div className="profile-field">
            <label>Full Name</label>
            <input
              type="text"
              name="studName"
              value={studentData.studName}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="profile-field">
            <label>Email ID</label>
            <input type="text" value={studentData.emailId} disabled />
          </div>

          <div className="profile-field">
            <label>College</label>
            <input
              type="text"
              name="college"
              value={studentData.college}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="profile-field">
            <label>Department</label>
            <input
              type="text"
              name="deptName"
              value={studentData.deptName}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
        </div>

        {editMode && (
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;

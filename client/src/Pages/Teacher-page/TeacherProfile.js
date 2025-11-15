import React, { useEffect, useState } from "react";
import "./../../CSS/index.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaSchool } from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
const backendUrl = process.env.REACT_APP_BACKEND_URL; 
const TeacherProfile = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
const emailId= sessionStorage.getItem("emailId") || localStorage.getItem("emailId") ||  Cookies.get("teacherEmail");

  // Fetch teacher data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${backendUrl}teacher/fetchTeacherData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailId }),
        });
        const result = await res.json();
        setTeacherData(result.data);
        setImagePreview(result.data?.profilePic);
      } catch (err) {
        console.error("Error fetching teacher data:", err);
      }
    };
    fetchData();
  }, [emailId]);

  const handleChange = (e) => {
    setTeacherData({ ...teacherData, [e.target.name]: e.target.value });
  };

  // Update profile details
  const handleSave = async () => {
    try {
      const res = await fetch(`${backendUrl}teacher/updateTeacher`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherData),
      });
      const result = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
        setEditMode(false);
        setTeacherData(result.data);
      } else {
        toast.error(result.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    }
  };

  // Upload new profile picture
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file)); // Show preview instantly

    const formData = new FormData();
    formData.append("profilePic", file);
    // formData.append("emailId", emailId);

    try {
      const res = await fetch(`${backendUrl}teacher/updateProfilePic`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Profile picture updated!");
        setTeacherData(result.data);
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading image");
    }
  };

  if (!teacherData) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <label htmlFor="upload-photo">
            <img
              src={
                imagePreview ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
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
          <h2>{teacherData.teacherName}</h2>
          <p>{teacherData.emailId}</p>
          <p><FaSchool /> {teacherData.college}</p>
          <p><IoSchool /> {teacherData.deptName}</p>
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
              name="teacherName"
              value={teacherData.teacherName}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="profile-field">
            <label>Email ID</label>
            <input type="text" value={teacherData.emailId} disabled />
          </div>

          <div className="profile-field">
            <label>College</label>
            <input
              type="text"
              name="college"
              value={teacherData.college}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="profile-field">
            <label>Department</label>
            <input
              type="text"
              name="deptName"
              value={teacherData.deptName}
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

export default TeacherProfile;
const express= require("express");
const app=express();
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const teacher = require('../models/teacher');
const FeedbackForm = require("../models/feedbackForm");
const FeedbackResponse = require("../models/feedbackResponse");
const {validateTeacher}= require("../utils/validator");

// const {cloudinary}= require("../utils/cloudinary.js");









// const cloudinary = require("../config/cloudinaryConfig");
// const Teacher = require("../models/teacher");

app.use(cookieParser());

const registerTeacher = async (req, res) => {
  try {
    validateTeacher(req.body);

    req.body.password = await bcrypt.hash(req.body.password, 10);
    await teacher.create(req.body);

    // send only one success response
    return res.status(200).json({ message: "Teacher Registered Successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const loginTeacher = async (req, res) => {
  try {
    const people = await teacher.findOne({ emailId: req.body.emailId });

    if (!people) {
      throw new Error("Invalid Credentials");
    }

    if (!people.isApprove) {
      return res.status(403).json({ message: "Account not approved yet" });
    }

    const isAllowed = await bcrypt.compare(req.body.password, people.password);

    if (!isAllowed) {
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign(
      { id: people.id, emailId: people.emailId },
      "Isha@123",
      { expiresIn: 10 * 60 } // 10 minutes for example
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    //  send actual email from the logged-in teacher
    res.status(200).json({
      message: "Teacher Login Successfully",
      emailId: people.emailId,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const logoutTeacher= (req,res)=>{
    try{
        res.cookie("token",null,{expires:new Date(Date.now())});
        res.status(200).json({ message: "Teacher Logout Successfully" });
    }catch(err){
        res.status(400).json({ error: err.message });
    }
}


const fetchTeacherData=async(req,res)=>{
    try{
      const {emailId}=req.body;
       const data = await teacher.findOne({ emailId });
       res.status(200).json({data});
    }catch(err){
        res.status(400).json({ error: err.message });
    }
}



const updateTeacher = async (req, res) => {
  try {
    const { emailId, teacherName, college, deptName } = req.body;

    const updatedTeacher = await teacher.findOneAndUpdate(
      { emailId },
      { teacherName, college, deptName },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedTeacher,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const countNumberOfForm = async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).json({ error: "emailId is required" });
    }

    const count = await FeedbackForm.countDocuments({ emailId });

    return res.status(200).json({
      message: "Count fetched successfully",
      count: count,
    });

  } catch (error) {
    console.error("Error counting documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




const countNumberOfResponse = async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).json({ error: "emailId is required" });
    }

    const count = await FeedbackResponse.countDocuments({teacherEmail : emailId });

    return res.status(200).json({
      message: "Count fetched successfully",
      count: count,
    });

  } catch (error) {
    console.error("Error counting documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// For profile pic upload and update

//  const updateProfilePic = async (req, res) => {
//   try {
//     const { emailId } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ message: "No image uploaded" });
//     }

//     // Upload image to Cloudinary
//     const uploadResult = await cloudinary.uploader.upload_stream(
//       { folder: "teacher_profiles" },
//       async (error, result) => {
//         if (error) return res.status(500).json({ error: error.message });

//         const updatedTeacher = await teacher.findOneAndUpdate(
//           { emailId },
//           { profilePic: result.secure_url },
//           { new: true }
//         );

//         res.status(200).json({
//           message: "Profile picture updated successfully",
//           data: updatedTeacher,
//         });
//       }
//     );

//     // Pipe buffer to Cloudinary
//     uploadResult.end(req.file.buffer);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };




// import Teacher from "../models/teacher.js";
const updateProfilePic = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Upload image buffer to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "teacher_profiles" },
      async (error, uploadResult) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ error: "Image upload failed" });
        }

        // Update teacher document in MongoDB
        const teacher = await teacher.findByIdAndUpdate(
          req.body.teacherId,
          { profilePic: uploadResult.secure_url },
          { new: true }
        );

        res.status(200).json({
          success: true,
          message: "Profile picture updated successfully",
          teacher,
        });
      }
    );

    result.end(file.buffer);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};




const changeTeacherDp = async (req, res) => {
  try {
    const emailId = req.body.emailId;
    const dp = req.file ? req.file.path : null; // Cloudinary URL

    
    if (!emailId || !dp) {
      return res.status(400).json({ error: "Email and image are required" });
    }

    const updateDp = await teacher.updateOne(
      { emailId },
      { $set: { profilePic: dp } }
    );

    if (updateDp.modifiedCount === 0) {
      return res.status(404).json({
        error: "User not found or DP not updated",
      });
    }

    return res.status(200).json({
      message: "Successfully updated",
      data: { profilePic: dp },
    });

  } catch (error) {
    console.error("Error updating DP:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = {
  registerTeacher,
  loginTeacher,
  logoutTeacher,
  fetchTeacherData,
  updateTeacher,
  updateProfilePic,
  changeTeacherDp,
  countNumberOfForm,
  countNumberOfResponse
};



// module.exports={ loginTeacher,registerTeacher,logoutTeacher,fetchTeacherData , updateTeacher, updateProfilePic};
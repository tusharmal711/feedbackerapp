const express= require("express");
const app=express();
const bcrypt = require("bcrypt");
const nodemailer =require("nodemailer");
const dotenv=require("dotenv");
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const admin = require('../models/admin');
const teacher = require('../models/teacher');
const student = require('../models/student');
app.use(cookieParser());
dotenv.config();

const sender = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const loginAdmin = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find admin by email
    const people = await admin.findOne({ emailId });
    if (!people) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    // Compare passwords
    const isAllowed = await bcrypt.compare(password, people.password);
    if (!isAllowed) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: people.id, emailId: people.emailId },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

    return res.status(200).json({ message: "Login Successfully", success: true });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

//admin profile with middleware check auth.
const logoutAdmin= (req,res)=>{
    try{
        res.cookie("token",null,{expires:new Date(Date.now())});
        res.status(200).json({ message: "Logout Successfully" });
    }catch(err){
        res.status(400).json({ error: err.message });
    }
}




const mailSend = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: sender,
    pass: emailPass,
  },
});









//pending Teacher list 

const pendingTeacher = async (req, res) => {
  try {
    const people = await teacher.find({ isApprove: false });
   

    if (people.length === 0) {
      return res.status(404).json({ message: "No pending teacher found" });
    }

    res.status(200).json({ message: "All pending Teacher Details Fetched", people });
  } catch (err) {
    console.error("Error in pendingTeacher:", err);
    res.status(400).json({ error: err.message });
  }
};

//Pending Student List

const pendingStudent = async (req, res) => {
  try {
    const people = await student.find({ isApprove: false });
   

    if (people.length === 0) {
      return res.status(404).json({ message: "No pending teacher found" });
    }
    
    res.status(200).json({ message: "All pending Teacher Details Fetched", people });
  } catch (err) {
    console.error("Error in pendingTeacher:", err);
    res.status(400).json({ error: err.message });
  }
};
const approvedStudent = async (req, res) => {
  try {
    const people = await student.find({ isApprove: true });
   

    if (people.length === 0) {
      return res.status(404).json({ message: "No pending teacher found" });
    }
    
    res.status(200).json({ message: "All pending Teacher Details Fetched", people });
  } catch (err) {
    console.error("Error in pendingTeacher:", err);
    res.status(400).json({ error: err.message });
  }
};

//approveTeacher
const approveTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacherData = await teacher.findById(id);
    if (!teacherData) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Already approved?
    if (teacherData.isApprove === true) {
      return res.status(400).json({ message: "Teacher already approved" });
    }

    // Update teacher approval
    const updatedTeacher = await teacher.findByIdAndUpdate(
      id,
      { isApprove: true },
      { new: true }
    );
      res.status(200).json({ message: "Teacher approved successfully", data: updatedTeacher });
    try {
      await mailSend.sendMail({
        from: `"FeedBacker" <${sender}>`,
        to: teacherData.emailId, // make sure this field exists
        subject: "FeedBacker - Approved by admin",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            
            <p>You have been approved by the admin! 🎉</p>
            <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">
              Congratulations!
            </div>
            <p>You can now login and perform your tasks in the FeedBacker portal.</p>
          </div>`,
      });
      console.log("mail-send");
    } catch (mailErr) {
      console.error("Error sending email:", mailErr.message);
      // don’t stop the API, just warn
    }

   
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



const approvedTeacher = async (req, res) => {
  try {
    const people = await teacher.find({ isApprove: true });
   

    if (people.length === 0) {
      return res.status(404).json({ message: "No pending teacher found" });
    }
    
    res.status(200).json({ message: "All pending Teacher Details Fetched", people });
  } catch (err) {
    console.error("Error in pendingTeacher:", err);
    res.status(400).json({ error: err.message });
  }
};

//approveStudent
const approveStudent=async(req,res)=>{
    try{
        const { id } = req.params;
        const studentData = await student.findById(id);
        if (!studentData) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check if already approved
        if (studentData.isApprove === true) {
            return res.status(400).json({ message: "Student already approved" });
        }
        const updatedStudent = await student.findByIdAndUpdate(
            id,
            { isApprove: true },
            { new: true }
            );
       

        res.status(200).json({ message: "Student Approved" , data:updatedStudent});


         try {
      await mailSend.sendMail({
        from: `"FeedBacker" <${sender}>`,
        to: studentData.emailId, // make sure this field exists
        subject: "FeedBacker - Approved by admin",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            
            <p>You have been approved by the admin! 🎉</p>
            <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">
              Congratulations!
            </div>
            <p>You can now login and give feedback in the FeedBacker portal.</p>
          </div>`,
      });
      console.log("mail-send");
    } catch (mailErr) {
      console.error("Error sending email:", mailErr.message);
      // don’t stop the API, just warn
    }












    }catch(err){
        res.status(400).json({ error: err.message });
    }
}

//reject teacher
const rejectTeacher=async(req,res)=>{
    try{
           const { id } = req.params;
        const studentData = await teacher.findById(id);
        if (!studentData) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const deleteteacher = await teacher.findByIdAndDelete(id);
       

        res.status(200).json({ message: "Teacher deleted" , data:deleteteacher});
    }catch(err){
        res.status(400).json({ error: err.message });
    }
}
//reject student
const rejectStudent=async(req,res)=>{
    try{
           const { id } = req.params;
        const studentData = await student.findById(id);
        if (!studentData) {
            return res.status(404).json({ message: "Student not found" });
        }
        const deleteStudent = await student.findByIdAndDelete(id);
       

        res.status(200).json({ message: "Student deleted" , data:deleteStudent});
    }catch(err){
        res.status(400).json({ error: err.message });
    }
}

module.exports={ loginAdmin,logoutAdmin,pendingTeacher,approvedTeacher,approvedStudent,pendingStudent,approveTeacher,approveStudent,rejectTeacher,rejectStudent};



    //    const people = await admin.findOne({ emailId: req.body.emailId });
    //    console.log(req.body.emailId)

 
// const registerTeacher=async(req,res)=>{
//     try{
//         console.log(req.body);
//         validateuser(req.body);
        
//         req.body.password=await bcrypt.hash(req.body.password,10);
//         await teacher.create(req.body);
//        res.send("user Register Successfully");

//     }catch(err){
//         res.send("Error "+err.message);
//     }
// }

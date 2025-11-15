const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const student = require("../models/student");
const { validateStudent } = require("../utils/validator");

// Register
const registerStudent = async (req, res) => {
  try {
    validateStudent(req.body);

    req.body.password = await bcrypt.hash(req.body.password, 10);
    await student.create(req.body);

    res.status(200).json({ success: true, message: "Student Registered Successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Login
const loginStudent = async (req, res) => {
  try {
    const people = await student.findOne({ emailId: req.body.emailId });
    if (!people) throw new Error("Invalid Credentials");

    if (!(req.body.emailId === people.emailId))
      throw new Error("Invalid Credentials");

    if (!people.isApprove) {
      return res.status(403).json({ success: false, message: "Account not approved yet" });
    }

    const isAllowed = await bcrypt.compare(req.body.password, people.password);
    if (!isAllowed) throw new Error("Invalid Credentials");

    const token = jwt.sign(
      { id: people.id, emailId: people.emailId },
      "Isha@123",
      { expiresIn: "1h" } // better use 1h instead of 10 sec
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ success: true, message: "Student Login Successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Logout
const logoutStudent = (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).json({ message: "Student Logout Successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Fetch Student Data
const fetchStudentData = async (req, res) => {
  try {
    const { emailId } = req.body;
     
    const data = await student.findOne({ emailId });
 
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Student Profile
const updateStudent = async (req, res) => {
  try {
    const { emailId, studName, college, deptName } = req.body;

    const updatedStudent = await student.findOneAndUpdate(
      { emailId },
      { studName, college, deptName },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedStudent,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Student Profile Picture

const changeStudentDp = async (req, res) => {
  try {
    const emailId = req.body.emailId;
    const dp = req.file ? req.file.path : null; // Cloudinary URL

    console.log("Email:", emailId);
    console.log(dp);
    if (!emailId || !dp) {
      return res.status(400).json({ error: "Email and image are required" });
    }

    const updateDp = await student.updateOne(
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



module.exports = { registerStudent, loginStudent, logoutStudent ,fetchStudentData, updateStudent, changeStudentDp  };

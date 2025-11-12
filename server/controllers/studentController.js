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
const updateProfilePic = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Upload image buffer to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "student_profiles" },
      async (error, uploadResult) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ error: "Image upload failed" });
        }

        // Update student document in MongoDB
        const student = await Student.findByIdAndUpdate(
          req.body.studentId,
          { profilePic: uploadResult.secure_url },
          { new: true }
        );

        res.status(200).json({
          success: true,
          message: "Profile picture updated successfully",
          student,
        });
      }
    );

    result.end(file.buffer);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { registerStudent, loginStudent, logoutStudent ,fetchStudentData, updateStudent, updateProfilePic  };

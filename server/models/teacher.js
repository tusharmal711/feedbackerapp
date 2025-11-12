const mongoose = require("mongoose");
const { Schema } = mongoose;

const teacherSchema = new Schema({
  teacherName: {
    type: String,
    required: true,
  },
  emailId: {
    required: true,
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    immutable: true,
  },
  college: {
    type: String,
    required: true,
  },
  deptName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // ✅ New profile picture field with default image
  profilePic: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // default profile image
  },
  isApprove: {
    type: Boolean,
    default: false,
  },
});

const teacher = mongoose.model("teacher", teacherSchema);

module.exports = teacher;

const express = require("express");
const {
  createFeedbackForm,
  getFormByTeacher,
} = require("../controllers/feedbackFormController");

const router = express.Router();

// Create form
router.post("/create", createFeedbackForm);

// Get forms by teacher
router.get("/teacher/:teacherId", getFormByTeacher);

module.exports = router;

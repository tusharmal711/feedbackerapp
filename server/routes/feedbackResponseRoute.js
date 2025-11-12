const express = require("express");
const {
  getAvailableForms,
  getFormById,
  submitFeedbackResponse,
  getResponsesByForm,
  checkIfSubmitted
} = require("../controllers/feedbackResponseController");



const router = express.Router();
router.post("/getAvailableForms",getAvailableForms);
router.get("/getForm/:id",getFormById);
router.post("/submitFeedbackResponse",submitFeedbackResponse);
router.get("/getResponses/:formId", getResponsesByForm);
router.get("/checkIfSubmitted", checkIfSubmitted);
module.exports = router;

const express = require("express");
const {
  createQuestion,
  getQuestions,
} = require("../controllers/questionController");

const router = express.Router();

router.post("/addQuestions", createQuestion);
router.get("/getAllQuestions", getQuestions);

module.exports = router;

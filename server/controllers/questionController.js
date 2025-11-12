const Question = require("../models/question");

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const { text } = req.body;
    const question = new Question({ text });
    await question.save();
    res.status(201).json({ message: "Question created", question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all questions
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createQuestion, getQuestions };

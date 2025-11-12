const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: {
    type: String,
    enum: ["dropdown", "mcq", "text"],
    required: true,
  },
  options: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Question", QuestionSchema);

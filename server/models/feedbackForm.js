const mongoose = require("mongoose");

const FeedbackFormSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      required: true,
    },
    formTitle: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
    },
    courseName: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FeedbackForm", FeedbackFormSchema);

const mongoose = require("mongoose");

const FeedbackResponseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeedbackForm",
      required: true,
    },

    teacherEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      ref: "Teacher",
    },

    studentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      ref: "Student",
    },

    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        response: {
          type: String,
          required: true,
        },
      },
    ],

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("FeedbackResponse", FeedbackResponseSchema);

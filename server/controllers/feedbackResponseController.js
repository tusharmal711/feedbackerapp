const FeedbackResponse = require("../models/feedbackResponse");
const Student = require("../models/student");
const FeedbackForm = require("../models/feedbackForm");


const getAvailableForms = async (req, res) => {
  try {
    const { stuEmail } = req.body;
    console.log("Student Email:", stuEmail);

    // 1️⃣ Validate input
    if (!stuEmail) {
      return res.status(400).json({
        success: false,
        message: "Student email is required",
      });
    }

    // 2️⃣ Find the student by email
    const student = await Student.findOne({ emailId: stuEmail });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 3️⃣ Find feedback forms based on college, course, and semester
    // 🔥 Sorted by latest (newest first)
    const forms = await FeedbackForm.find({
      college: student.college,
      courseName: student.deptName,
      semester: student.semester,
    })
      .populate("questions")
      .sort({ createdAt: -1 }); // ✅ Sort by createdAt DESC

    // 4️⃣ Return response
    res.status(200).json({
      success: true,
      count: forms.length,
      forms,
    });
  } catch (error) {
    console.error("❌ Error fetching available forms:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching available forms",
      error: error.message,
    });
  }
};

// ✅ 2. Get one specific form with questions
const getFormById = async (req, res) => {
  try {
    const form = await FeedbackForm.findById(req.params.id).populate("questions");
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ message: "Error fetching form" });
  }
};

// ✅ 3. Submit a feedback response
const submitFeedbackResponse = async (req, res) => {
  try {
    const { formId, teacherEmail, studentEmail, answers } = req.body;

    // 🔍 Validate fields
    if (!formId || !teacherEmail || !studentEmail || !answers || answers.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ⚠️ Check if student has already submitted feedback for this form
    const existingResponse = await FeedbackResponse.findOne({ formId, studentEmail });
    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: "Feedback already submitted for this form",
      });
    }

    // 🧾 Create a new feedback response
    const newResponse = new FeedbackResponse({
      formId,
      teacherEmail,
      studentEmail,
      answers,
    });

    await newResponse.save();

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("❌ Error submitting feedback:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while submitting feedback",
    });
  }
};

const countStudentResponse = async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).json({ error: "emailId is required" });
    }

    const count = await FeedbackResponse.countDocuments({studentEmail : emailId });

    return res.status(200).json({
      message: "Count fetched successfully",
      count: count,
    });

  } catch (error) {
    console.error("Error counting documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🔍 Check if student already submitted
const checkIfSubmitted = async (req, res) => {
  try {
    const { formId, studentEmail } = req.query;

    if (!formId || !studentEmail) {
      return res.status(400).json({ success: false, message: "Missing parameters" });
    }

    const existingResponse = await FeedbackResponse.findOne({ formId, studentEmail });

    if (existingResponse) {
      return res.json({ success: true, submitted: true });
    } else {
      return res.json({ success: true, submitted: false });
    }
  } catch (error) {
    console.error("Error checking submission:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};





const  getResponsesByForm = async (req, res) => {
  try {
    const { formId } = req.params;

    // Fetch all responses for this form
    const responses = await FeedbackResponse.find({ formId })
      .populate("formId")
      .populate({
        path: "answers.questionId",
        select: "questionText",
      })
      .lean();

    // Fetch form questions
    const form = await FeedbackForm.findById(formId).populate("questions");

    // Get all students for each response
    const formattedResponses = await Promise.all(
      responses.map(async (r) => {
        const student = await Student.findOne({ emailId: r.studentEmail });
      //  console.log(`This is your email: ${r.studentEmail}`);

        return {
          studentName: student?.studName || "Unknown",
          studentRoll: student?.uniRoll || "N/A",
          answers: r.answers.map((a) => ({
            questionId: a.questionId._id.toString(),
            response: a.response,
          })),
        };
      })
    );

    res.status(200).json({
      success: true,
      questions: form.questions.map((q) => ({
        _id: q._id.toString(),
        questionText: q.questionText,
      })),
      responses: formattedResponses,
    });
  } catch (error) {
    console.error("Error fetching responses:", error);
    res.status(500).json({ message: "Error fetching responses" });
  }
};









module.exports = { getAvailableForms,
  countStudentResponse,
  getFormById,
  submitFeedbackResponse,
  getResponsesByForm,
  checkIfSubmitted,
  
 };

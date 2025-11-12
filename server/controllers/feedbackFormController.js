const FeedbackForm = require("../models/feedbackForm");
const Question = require("../models/question");
const Teacher = require('../models/teacher');
// Create new feedback form
const createFeedbackForm = async (req, res) => {
  try {
    const { emailId, formTitle, courseName, semester, description, questions } = req.body || req.body.data;
    console.log(emailId, formTitle, courseName, semester, description, questions);
        
    // 1️⃣ Validate input
    if (!emailId || !formTitle || !questions || questions.length === 0) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // 2️⃣ Find the teacher by email
    const teacher = await Teacher.findOne({ emailId });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Extract college and teacherName
    const college = teacher.college;
    const creator = teacher.teacherName;

    // 3️⃣ Save all questions first
    const savedQuestions = await Question.insertMany(questions);

    // 4️⃣ Create feedback form
    const newForm = new FeedbackForm({
      emailId,
      formTitle,
      college,       // ✅ From teacher collection
      creator,       // ✅ From teacher collection
      courseName,
      semester,
      description,
      questions: savedQuestions.map((q) => q._id),
      
    });

    await newForm.save();

    // 5️⃣ Send response
    res.status(201).json({
      message: "Feedback form created successfully",
      form: newForm,
    });
  } catch (error) {
    console.error("❌ Error creating feedback form:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};







// Get forms for a specific teacher
const getFormByTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    const forms = await FeedbackForm.find({ teacher: teacherId })
      .populate("teacher")
      .populate("questions");

    if (!forms || forms.length === 0) {
      return res
        .status(404)
        .json({ message: "No forms found for this teacher" });
    }

    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// ✅ Get all forms created by a teacher (by email)
const getTeacherForms = async (req, res) => {
  try {
    const { emailId } = req.params;
    const forms = await FeedbackForm.find({ emailId }).sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ message: "Failed to fetch forms" });
  }
};

// ✅ Delete a form by ID
const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FeedbackForm.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Form not found" });
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ message: "Failed to delete form" });
  }
};

// Update an existing form
const getFormById = async (req, res) => {
  try {
    const form = await FeedbackForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ message: "Error fetching form" });
  }
};





async function getQuestions(req, res) {
  try {
    const form = await FeedbackForm.findById(req.params.id)
      .populate("questions"); // 🧩 Important — populates Question details

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form with questions:", error);
    res.status(500).json({ message: "Error fetching form" });
  }
}







// ✅ Update Form
const updateFormById = async (req, res) => {
  try {
    const { formTitle, courseName, semester, description, questions } = req.body;

    const updatedForm = await FeedbackForm.findByIdAndUpdate(
      req.params.id,
      {
        formTitle,
        courseName,
        semester,
        description,
        questions,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({ message: "Form updated successfully", updatedForm });
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ message: "Error updating form" });
  }
};
// ✅ Route


module.exports = { createFeedbackForm, getFormByTeacher ,deleteForm ,getQuestions, getTeacherForms, getFormById , updateFormById};

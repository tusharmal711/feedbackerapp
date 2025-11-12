const express = require("express");
const router = express.Router();
// const upload = require("../middleware/uploadMiddleware.js");
const {
  registerTeacher,
  loginTeacher,
  logoutTeacher,
  fetchTeacherData,
  updateTeacher,
  updateProfilePic
} = require("../controllers/teacherController.js");
const {createFeedbackForm,getTeacherForms,deleteForm,updateForm,getFormById, updateFormById, getQuestions}=require("../controllers/feedbackFormController.js");
router.post("/registerTeacher", registerTeacher);
router.post("/loginTeacher", loginTeacher);
router.post("/logoutTeacher", logoutTeacher);
router.post("/fetchTeacherData", fetchTeacherData);
router.put("/updateTeacher", updateTeacher);
router.put("/updateProfilePic", updateProfilePic);
router.post("/createForm",createFeedbackForm);
// router.put("/updateProfilePic", upload.single("profilePic"), updateProfilePic);
router.get("/teacherForms/:emailId", getTeacherForms);
router.delete("/deleteForm/:id", deleteForm);
router.put("/updateForm/:id", updateFormById);
router.get("/form/:id", getFormById);
router.get("/getQuestions/:id", getQuestions);
module.exports = router;
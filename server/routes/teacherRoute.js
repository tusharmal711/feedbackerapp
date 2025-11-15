const express = require("express");
const router = express.Router();
// const upload = require("../middleware/uploadMiddleware.js");
const upload = require("../upload");  
const {
  registerTeacher,
  loginTeacher,
  logoutTeacher,
  fetchTeacherData,
  updateTeacher,
  updateProfilePic,
  countNumberOfForm,
  changeTeacherDp ,
  countNumberOfResponse
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
router.post("/changeTeacherDp", upload.single("dp"), changeTeacherDp);
router.delete("/deleteForm/:id", deleteForm);
router.put("/updateForm/:id", updateFormById);
router.get("/form/:id", getFormById);
router.post("/countNumberOfForm", countNumberOfForm);
router.post("/countNumberOfResponse", countNumberOfResponse);
router.get("/getQuestions/:id", getQuestions);
module.exports = router;
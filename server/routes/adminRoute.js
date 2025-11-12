const express= require("express");
const router = express.Router();
const { loginAdmin,logoutAdmin,pendingTeacher,approvedTeacher,approvedStudent,pendingStudent,approveTeacher,approveStudent ,rejectTeacher,rejectStudent} = require("../controllers/adminController");

const {adminMiddleware}= require("../middleware/teacherMiddleware");
// router.post("/register",registerAdmin);

router.post("/login",loginAdmin);

router.post("/logout",logoutAdmin);


router.post("/pendingStudent",pendingStudent);
router.post("/approvedStudent",approvedStudent);
router.post("/approvedTeacher",approvedTeacher);
router.post("/pendingTeacher",pendingTeacher);

router.put("/approveTeacher/:id",approveTeacher);

router.put("/approveStudent/:id",approveStudent);

router.delete("/rejectStudent/:id",rejectStudent);
router.delete("/rejectTeacher/:id",rejectTeacher);
//router.post("/registerTeacher",authMiddleware,registerTeacher);
module.exports=router;
const express= require("express");
const router = express.Router();
const { registerStudent, loginStudent ,logoutStudent , fetchStudentData , updateStudent} = require("../controllers/studentController");

router.post("/registerStudent",registerStudent);

router.post("/loginStudent",loginStudent);

router.post("/logoutStudent",logoutStudent);// for authentication use middleware here

router.post("/fetchStudentData", fetchStudentData);
router.put("/updateStudent", updateStudent);
module.exports=router;
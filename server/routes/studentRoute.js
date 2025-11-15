const express= require("express");
const upload = require("../upload"); 
const router = express.Router();

const { registerStudent, loginStudent ,changeStudentDp,logoutStudent , fetchStudentData , updateStudent} = require("../controllers/studentController");

router.post("/registerStudent",registerStudent);

router.post("/loginStudent",loginStudent);
router.post("/changeStudentDp", upload.single("dp"), changeStudentDp);
router.post("/logoutStudent",logoutStudent);// for authentication use middleware here

router.post("/fetchStudentData", fetchStudentData);
router.put("/updateStudent", updateStudent);
module.exports=router;
const validator= require("validator");
const { z } = require("zod");

function validateStudent(data){

  const schema = z.object({
    studName: z
      .string()
      .min(3, "Student name must be at least 3 characters")
      .max(50, "Student name must be at most 50 characters"),
    
    emailId: z
      .string()
      .email("Invalid email format"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    college: z
      .string()
      .min(1, "College is required"),

    deptName: z
      .string()
      .min(1, "Department name is required"),
    uniRoll: z
      .string()
      .min(1, "University roll number is required"),

    section: z
      .string()
      .min(1, "Section is required"),

    semester: z
      .string()
      .min(1, "Semester is required"),

    
  });

  return schema.parse(data);


}

function validateTeacher(data){
 
  const schema = z.object({
    teacherName: z
      .string()
      .min(3, "Student name must be at least 3 characters")
      .max(50, "Student name must be at most 50 characters"),
    
    emailId: z
      .string()
      .email("Invalid email format"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    college: z
      .string()
      .min(1, "College is required"),

    deptName: z
      .string()
      .min(1, "Department name is required"),
  });

  return schema.parse(data);


}

module.exports={validateStudent, validateTeacher};


// function validateuser(data){
//       const mandatory=["teacherName","emailId",'password','college','deptName'];
//         const isAllowed = mandatory.every((k)=>Object.keys(data).includes(k));
//         if(!isAllowed)
//             throw new Error("Fields Missing");

//         if(!validator.isEmail(data.emailId))
//             throw new Error("invalid Email");
//          if(!validator.isStrongPassword(data.password))
//             throw new Error("weak password");
//          if(!((data.teacherName.length) >3 &&  (data.teacherName.length)<=20))
//             throw new Error("Name Should have atleast 3 and atmost 20 charecter");

// }
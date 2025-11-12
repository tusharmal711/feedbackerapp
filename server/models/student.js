const mongoose =require('mongoose') ;
const { Schema } = mongoose;


const studentSchema = new Schema({
    studName:{
        type:String, required:true
    },
    emailId:{
        required:true,
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true
    },
   
    college:{
        type:String,required:true
    },
    deptName:{
        type:String,required:true
    },
    uniRoll: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    section:{
        type:String,required:true
    },
    semester:{
        type:String,required:true
    },
     password:{
        type:String,  required:true
    },
    isApprove:{
        type:Boolean,default:false
    }

});

const student = mongoose.model("Student",studentSchema);

module.exports=student;
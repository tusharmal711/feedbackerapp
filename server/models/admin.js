const mongoose =require('mongoose') ;
const { Schema } = mongoose;


const adminSchema = new Schema({
    adminName:{
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
    password:{
        type:String,  required:true
    }

});

const admin = mongoose.model("admin",adminSchema);

module.exports=admin;
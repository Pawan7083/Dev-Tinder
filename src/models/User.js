const mongoose = require("mongoose");
const validator= require("validator");

const UserSchema= new mongoose.Schema({
    firstName : {
        type:String,
        required: true,
        trim:true,
        minLength : 4,
        maxLength : 50,
    },
    lastName:{
        type:String,
        trim:true,
        maxLength : 50,

    },
    email:{
        type : String, 
        required : true,
        unique: true,
        trim: true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value))throw new Error("please enter valid email");
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value))throw new Error("Please enter strong password");
        }
    },
    gender:{
        type: String,
        enum: {
            values: ["male", "female","others"],
            message: '{VALUE} is not invalid'
        }
    },
    about:{
        type:String,
        default:"This is a software engineer.",
        maxLength:250,
    },
    skills:{
        type:[String]
    }
},{timestamps:true});

const User = mongoose.model("User", UserSchema);
module.exports= {User};
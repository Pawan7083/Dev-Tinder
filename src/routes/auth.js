const express= require("express");
const validator= require("validator");
const {User}= require("../models/User");
const bcrypt= require("bcryptjs");
const jwt= require("jsonwebtoken");

const auth= express.Router();

auth.post("/signup",async(req,res,next)=>{
    try{
            const { firstName, lastName, email,password}=req.body;
            validator.trim(firstName);
            validator.trim(lastName);
            validator.trim(email);
            if(!validator.isLength(firstName,4))throw new Error("First Name should be atleast 4 characters.");
            if(!validator.isEmail(email)) throw new Error("please enter valid email");
            if(!validator.isStrongPassword(password)) throw new Error("Please enter a strong password");

          
            const hashPassword=await bcrypt.hash(password,10);
            console.log(hashPassword);

        const user=  new User({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:hashPassword,
        })
        await user.save().then(()=>{

            res.send("User adde successfully");
        })
    }catch(error){
        // console.log("ERROR : "+ error);
        res.status(400).send("ERROR : "+ error);
    }
    
    // console.log("This is second /user request handler.");
    // res.send("This is the 2nd /user request handler.")
    // next();
});

auth.get("/login", async(req,res)=>{
    
    try{
        const {email,password}= req.body;
        if(!validator.isEmail(email))throw new Error("Please enter valid email");

        const user =await User.findOne({"email":email});
        if(!user)throw new Error("Invalid credential");
        
        const isValidPassword=await bcrypt.compare(password,user.password);
        if(!isValidPassword)throw new Error("Invalid credential!");

        const token= jwt.sign({id:user._id},"poiuytrewsdfghj;lkjhg",{expiresIn:"1h"});

        res.cookie("token",token);

        res.status(200).json("Login successfull.");
    }
    catch(error){
        res.status(400).send("ERROR : "+error);
    }
})

auth.post("/logout", async(req,res)=>{
    res.cookie("token",null,{expires:new Date()});
    res.status(200).send("Logout successfull.");
})

module.exports={auth};

const express= require("express");
const {userAuth}=require("../middleware/getAuth");
const {User}= require("../models/User")

const profile= express.Router();

profile.get("/view",userAuth, async(req,res)=>{
    const {user}= req.cookies;
    res.status(200).json({message:"user profile",user:user});
    
});

profile.patch("/edit", userAuth,async(req,res)=>{
    try{
         const ALLOWEDFIELD=["gender","about","skills"];

        const isAllowedValid= Object.keys(req.body).every((field)=>ALLOWEDFIELD.includes(field));
        if(!isAllowedValid)throw new Error("Invalid parameters passed");
        const loggedUser= new User(req.cookies.user);
        console.log(loggedUser);

        Object.keys(req.body).forEach((key)=>{
            loggedUser[key]=req.body[key];
        })
        const user = await User.findByIdAndUpdate(loggedUser._id,loggedUser,{returnDocument:"after"});
        res.status(201).json({message:"updated successfully!",data:user});

    }catch(error){
        res.status(400).send("ERROR : "+error.message);
    }

})

module.exports= {profile};
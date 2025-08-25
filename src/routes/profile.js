const express= require("express");
const {userAuth}=require("../middleware/getAuth");
const {User}= require("../models/User")
const bcrypt= require("bcryptjs");

const profile= express.Router();

profile.get("/view",userAuth, async(req,res)=>{
    const {user}= req.cookies;
    res.status(200).json({message:"user profile",user:user});
    
});

// profile.use(express.json());

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

});

profile.patch("/password",userAuth, async(req,res)=>{
    try{
        const ALLOWED_KEYWORD= ["password"];
        const isAllowedParameter= Object.keys(req.body).every((key)=> ALLOWED_KEYWORD.includes(key));
        if(!isAllowedParameter)throw new Error("Invalid request parameter");
        const {user} = req.cookies;
        
        user.password = await bcrypt.hash(req.body.password,10);

        await User.findByIdAndUpdate(user._id,user);
        
        res.status(200).send({password:req.body.password,user:user});
    }
    catch(error){
        res.status(200).send("ERROR : "+error.message);
    }
})

module.exports= {profile};
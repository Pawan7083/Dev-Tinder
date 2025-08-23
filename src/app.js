const express = require("express");
const {adminAuth,userAuth}= require("./middleware/getAuth");
const {ConnectDB} = require("./config/database");
const {User}= require("./models/User");
const validator = require("validator");
const bcrypt= require("bcryptjs");
const cookieParser= require("cookie-parser");
const jwt= require("jsonwebtoken");

// require("dotenv").config();


const  app= express();
app.use(cookieParser());
app.use(express.json());

app.use("/admin",adminAuth,(req,res,next)=>{
    next();
});
app.get("/admin/getData",(req,res,next)=>{
    res.send("This is /getData request handler for admin ");
})
// app.get("/user",(req,res,next)=>{
//     console.log("This is first /user request handler.");
//     next();
// })
app.post("/user",async(req,res,next)=>{
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
})

app.get("/login", async(req,res)=>{
    
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

app.get("/user",userAuth,(req,res)=>{
    const cookie= req.cookies;
    console.log(cookie);
    const {name,id}=req.query;
    res.end("<h1>This is the 3rd /user request handler.<h1>"+name + " "+ id);
})

app.get("/user/:name/:id",(req,res,next)=>{
    const {name,id}=req.params;
    res.status(201).end(name + " "+ id);
})


ConnectDB().then(()=>{
    console.log("Connection successfull");
    app.listen(7777,()=>{
        console.log("app lounched on port no 7777");
    })
}).catch((error)=>{
    console.log("Error : "+ error);
});

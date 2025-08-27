const express = require("express");
const {adminAuth,userAuth}= require("./middleware/getAuth");
const {ConnectDB} = require("./config/database");
const cookieParser= require("cookie-parser");
const {auth}=require("./routes/auth");
const {profile}= require("./routes/profile");
const {connectionRequest}= require("./routes/connectionRequest");
const {userRouter}= require("./routes/userRouter");

// require("dotenv").config();


const  app= express();
app.use(cookieParser());
app.use(express.json());
app.use("/",auth);
app.use("/profile",profile);
app.use("/request",connectionRequest);
app.use("/user",userRouter);

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

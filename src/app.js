const express = require("express");
const {adminAuth}= require("./middleware/getAuth");
const {ConnectDB} = require("./config/database");
const {User}= require("./models/User");
const validator = require("validator");


const  app= express();

app.use(express.json());

app.use("/admin",adminAuth,(req,res,next)=>{
    next();
});
app.get("/admin/getData",(req,res,next)=>{
    res.send("This is /getData request handler for admin ");
})
app.get("/user",(req,res,next)=>{
    console.log("This is first /user request handler.");
    next();
})
app.post("/user",async(req,res,next)=>{
    try{
            const { firstName, lastName, email,password}=req.body;
            validator.trim(firstName);
            validator.trim(lastName);
            validator.trim(email);
            if(!validator.isLength(firstName,4))throw new Error("First Name should be atleast 4 characters.");
            if(!validator.isEmail(email)) throw new Error("please enter valid email");
            if(!validator.isStrongPassword(password)) throw new Error("Please enter a strong password");

        const user=  new User({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:password
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
app.get("/user",(req,res)=>{
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

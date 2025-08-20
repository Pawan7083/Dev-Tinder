const express = require("express");
const {adminAuth}= require("./middleware/getAuth");
const {ConnectDB} = require("./config/database");



const  app= express();

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
app.get("/user",(req,res,next)=>{
    console.log("This is second /user request handler.");
    // res.send("This is the 2nd /user request handler.")
    next();
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

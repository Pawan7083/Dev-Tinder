const express = require("express");

const  app= express();
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



app.listen(7777);
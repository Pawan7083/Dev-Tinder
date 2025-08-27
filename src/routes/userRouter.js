const express = require("express");
const {userAuth}= require("../middleware/getAuth");
const { ConnectionRequest } = require("../models/ConnectionRequest");
const {User} =  require("../models/User");

const userRouter= express.Router();

userRouter.get("/connections",userAuth,async(req,res)=>{
    try{
        const {user}= req.cookies;
        const connectUser= await ConnectionRequest.find({$or:[{fromUserId:user._id},{toUserId:user._id}],status:"accepted"});
        res.status(200).json({"message":"Connected User",connectUser:connectUser});
    }catch(error){
        res.status(400).json({"error":error});
    }
});

userRouter.get("/request",userAuth,async(req,res)=>{
    try{
        const {user}= req.cookies;

        const requestUser= await ConnectionRequest.find({$or:[{fromUserId:user._id},{toUserId:user._id}],status:"intrested"});
        console.log(requestUser);
        res.status(200).json({"message":"User request to connect","data":requestUser});
    }catch(error){
        res.status(400).json({error:error});
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const {user}= req.cookies;

        const allUser= await User.find();
        console.log(allUser);
        // const filterData =

        res.status(200).json({allUser:allUser});
    }catch(error){
        res.status(400).json({error:error});
    }
})

module.exports= {userRouter};
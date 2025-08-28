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

        const allUser= await User.find({},{firstName:1,lastName:1,about:1,skill:1,gemder:1});
       
        const alreadyViewUser= await ConnectionRequest.find({$or:[{fromUserId:user._id},{toUserId:user._id}]},{fromUserId:1,toUserId:1,_id:0});
        
        const uniqueViewUser=new Set();
        alreadyViewUser.map((view)=>{
            uniqueViewUser.add(view.fromUserId.toString());
            uniqueViewUser.add(view.toUserId.toString());
        });
        const filterUser= allUser.filter((data)=>
            (!uniqueViewUser.has(data._id.toString()) && data._id.toString()!==user._id.toString())
        );

        res.status(200).json({data:filterUser});
    }catch(error){
        res.status(400).json({error:error.message});
    }
})

module.exports= {userRouter};
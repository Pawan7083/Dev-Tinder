const express = require("express");
const {userAuth}= require("../middleware/getAuth");
const {ConnectionRequest}= require("../models/ConnectionRequest");
const {User} = require("../models/User");

const connectionRequest= express.Router();

connectionRequest.post("/send/:status/:userId",userAuth,async(req,res)=>{
    try{
        const {user}= req.cookies;
        // console.log(user._id);
        const status= req.params.status;
        const toUserId= req.params.userId;
        // console.log(toUserId);
     
        const ALLOWED_STATUS= ["ignored","intrested"];

        const isValidStatus= ALLOWED_STATUS.includes(status);
        if(!isValidStatus)throw new Error("Invalid status");

        if(user._id===toUserId)throw new Error("Sorry! you are sending to himself");

        const isToUserVerified= await User.findById({_id:toUserId});
        if(!isToUserVerified) throw new Error("You are sending unverified user");

        const userExist = await ConnectionRequest.findOne({
            $or:[{fromUserId:user._id,toUserId:isToUserVerified._id},{fromUserId:isToUserVerified._id,toUserId:user._id}]
        });

        if(userExist)throw new Error("Already sent to request");

        const connectionRequest=new ConnectionRequest({fromUserId:user._id,toUserId:isToUserVerified._id,status:status});
        await connectionRequest.save();
        res.send({message:"Request "+status,connectionRequest:connectionRequest});
    }
    catch(error){
        res.status(400).json({"ERROR : ":error.message});
    }
    
})

connectionRequest.patch("/review/:status/:toUserId",userAuth,async(req,res)=>{
    try{ 
        const {user} = req.cookies;
        console.log(user._id);
        const {status,toUserId}=req.params;
        
        const ALLOWED_STATUS= ["accepted", "rejected"];

        if(!ALLOWED_STATUS.includes(status.toLowerCase()))throw new Error("Invalid status "+status);

        const validUser= await User.findOne({_id:toUserId});
        if(!validUser)throw new Error("You are sending unverified user");

        const connectionRequest= await ConnectionRequest.findOne({
            fromUserId:toUserId,toUser:user._id, status:"intrested"
        });

        if(!connectionRequest)throw new Error("Invalid request");
        console.log(connectionRequest);
        const updateRequest = await ConnectionRequest.findByIdAndUpdate({_id:connectionRequest._id},{status:status},{returnDocument:"after"});
        res.status(200).json({message:"requested Updated successfully.",data:updateRequest});
    }catch(error){
        res.status(200).send("ERROR : "+error);
    }
})


module.exports= {connectionRequest};
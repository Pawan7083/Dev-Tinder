const mongoose= require("mongoose");
const {User}= require("./User");

const ConnectionRequestSchema= new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User,
    },
    toUserId:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
    },
    status:{
        type:String,
        enum:{
            values:["ignored","intrested","accepted","rejected"],
            message:'{VALUE} is not supported',
        },
        required:true,
    }
},
{
    timestamps:true,
});

const ConnectionRequest= mongoose.model("ConnectionRequest",ConnectionRequestSchema);
module.exports= {ConnectionRequest};
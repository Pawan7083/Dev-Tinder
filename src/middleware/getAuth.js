const jwt= require("jsonwebtoken");
const {User}=require("../models/User");

const adminAuth = (req,res,next)=>{
    const token = "abc";
    const isAuthenticate= (token==="abc");
    if(!isAuthenticate){
        res.send("Admin is not authenticate");

    }
    else{
         next();
    }
}

const userAuth = async(req,res,next)=>{
    try{
        const {token}= req.cookies;
        if(!token) throw new Error("Invalid token");

        const decodeToken= jwt.verify(token,"poiuytrewsdfghj;lkjhg");
        const user=await User.findOne({"_id":decodeToken.id});
        if(!user)throw new Error("Invalid token");
        res.cookie("user",user);
        // res.user("user",user);
        next();
    }
    catch(error){
        res.status(400).send("ERROR : "+error.message);
    }
}

module.exports= {adminAuth,userAuth};
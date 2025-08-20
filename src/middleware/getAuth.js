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

module.exports= {adminAuth};
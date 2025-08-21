const mongoose = require("mongoose");

const ConnectDB= async()=>{
    await mongoose.connect("mongodb+srv://pawankr7083:QvTSfrXH97DwXn6G@cluster0.k6b5b9p.mongodb.net/DevTinder");
}

module.exports={ConnectDB};
const mongoose = require("mongoose");
require("dotenv").config();

const ConnectDB= async()=>{
    await mongoose.connect("mongodb+srv://pawankr7083:"+process.env.MONGODB_PASSWORD+"@cluster0.k6b5b9p.mongodb.net/DevTinder");
}

module.exports={ConnectDB};
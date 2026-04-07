const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({

 name:String,

 email:{
  type:String,
  unique:true
 },

 password:String,
 
 isVerified: {
  type: Boolean,
  default: false
 },
 
 otp: String,
 
 otpExpires: Date

});

module.exports = mongoose.model("Admin",adminSchema);
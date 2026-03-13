
const Admin = require("../models/Admin.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req,res)=>{

  const {email,password} = req.body;

  const hashedPassword = await bcrypt.hash(password,10);

  const admin = new Admin({
    email,
    password:hashedPassword
  });

  await admin.save();

  res.json({
    message:"Admin Registered"
  });

};

exports.loginAdmin = async (req,res)=>{

  const {email,password} = req.body;

  const admin = await Admin.findOne({email});

  if(!admin){
    return res.json({
      message:"Admin not found"
    });
  }

  const isMatch = await bcrypt.compare(password,admin.password);

  if(!isMatch){
    return res.json({
      message:"Wrong Password"
    });
  }

  const token = jwt.sign(
    {id:admin._id},
    "secretkey"
  );

  res.json({
    message:"Login Success",
    token
  });

};
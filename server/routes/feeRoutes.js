const express = require("express");
const router = express.Router();

const Fee = require("../models/Fee");
const Student = require("../models/Student");

router.post("/payFees", async(req,res)=>{

 const fee = new Fee(req.body);
 await fee.save();

 res.json({
   message:"Fee Paid Successfully"
 });

});

router.get("/fees", async(req,res)=>{

 const data = await Fee.find().populate("studentId");

 res.json(data);

});

module.exports = router;
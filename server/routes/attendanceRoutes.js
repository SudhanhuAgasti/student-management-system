const express = require("express");

const router = express.Router();

const Attendance = require("../models/Attendance");

router.post("/markAttendance", async(req,res)=>{

 const attendance = new Attendance(req.body);

 await attendance.save();

 res.json({
   message:"Attendance Marked"
 });

});

router.get("/attendance", async(req,res)=>{

 const data = await Attendance.find().populate("studentId");

 res.json(data);

});

module.exports = router;
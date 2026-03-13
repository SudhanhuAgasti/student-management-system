const express = require("express");

const router = express.Router();

const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Fee = require("../models/Fee");

router.get("/dashboard", async(req,res)=>{

 const totalStudents = await Student.countDocuments();
 const totalAttendance = await Attendance.countDocuments();
 const totalFees = await Fee.countDocuments();

 res.json({
   totalStudents,
   totalAttendance,
   totalFees
 });

});

module.exports = router;
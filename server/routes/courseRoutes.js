const express = require("express");

const router = express.Router();

const Course = require("../models/Course");

router.post("/addCourse", async(req,res)=>{

 const course = new Course(req.body);

 await course.save();

 res.json({
  message:"Course Added"
 });

});

router.get("/courses", async(req,res)=>{

 const courses = await Course.find();

 res.json(courses);

});

router.delete("/course/:id", async(req,res)=>{

 await Course.findByIdAndDelete(req.params.id);

 res.json({
   message:"Course Deleted"
 });

});

module.exports = router;
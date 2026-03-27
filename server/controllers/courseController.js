const Course = require("../models/Course");

exports.addCourse = async (req, res, next) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json({
      message: "Course Added Successfully"
    });
  } catch (err) {
    next(err);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({
      message: "Course Deleted Successfully"
    });
  } catch (err) {
    next(err);
  }
};

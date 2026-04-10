const Course = require("../models/Course");
const mongoose = require("mongoose");

exports.addCourse = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const course = new Course({ ...req.body, adminId });
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
    const adminId = req.user.id;
    const adminObjectId = new mongoose.Types.ObjectId(adminId);
    const courses = await Course.find({ adminId }).lean();

    // Get student count and revenue per course for THIS admin only
    const Student = require("../models/Student");
    const courseStats = await Student.aggregate([
      { $match: { adminId: adminObjectId } },
      {
        $group: {
          _id: "$course",
          count: { $sum: 1 },
          revenueExpected: { $sum: "$totalFees" },
          revenueCollected: { $sum: "$feesPaid" }
        }
      }
    ]);

    // Enrich with stats
    const enrichedCourses = courses.map(course => {
      const stats = courseStats.find(s => s._id === course.name) || { count: 0, revenueExpected: 0, revenueCollected: 0 };
      return {
        ...course,
        activeStudents: stats.count,
        revenueExpected: stats.revenueExpected || 0,
        revenueCollected: stats.revenueCollected || 0
      };
    });

    res.json(enrichedCourses);
  } catch (err) {
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const course = await Course.findOneAndDelete({ _id: req.params.id, adminId });
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

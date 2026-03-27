const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Fee = require("../models/Fee");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    const totalFees = await Fee.countDocuments();

    res.json({
      totalStudents,
      totalAttendance,
      totalFees
    });
  } catch (err) {
    next(err);
  }
};

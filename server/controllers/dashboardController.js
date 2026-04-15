const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Fee = require("../models/Fee");
const Teacher = require("../models/Teacher");
const Admin = require("../models/Admin");
const mongoose = require("mongoose");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === "admin") {
      const adminId = new mongoose.Types.ObjectId(userId);

      const totalStudents = await Student.countDocuments({ adminId });
      const totalAttendance = await Attendance.countDocuments({ adminId });
      const feeTransactionsCount = await Fee.countDocuments({ adminId });

      const revenueData = await Student.aggregate([
        { $match: { adminId } },
        { $group: { _id: null, totalRevenue: { $sum: "$feesPaid" } } }
      ]);
      const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

      const pendingFeesData = await Student.aggregate([
        { $match: { adminId } },
        {
          $project: {
            pending: { $max: [{ $subtract: ["$totalFees", "$feesPaid"] }, 0] }
          }
        },
        { $group: { _id: null, totalPending: { $sum: "$pending" } } }
      ]);
      const totalPendingFees = pendingFeesData.length > 0 ? pendingFeesData[0].totalPending : 0;

      const courseStats = await Student.aggregate([
        { $match: { adminId } },
        { $group: { _id: "$course", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      return res.json({
        role: "admin",
        instituteCode: req.user.instituteCode || "N/A",
        totalStudents,
        totalAttendance,
        feeTransactionsCount,
        totalRevenue,
        totalPendingFees,
        courseStats
      });
    } else if (role === "student") {
      const Class = require("../models/Class");
      
      const student = await Student.findById(userId).populate("adminId", "name");
      if (!student) {
        return res.status(404).json({ message: "Student record not found" });
      }

      const assignedClass = await Class.findOne({ "students.rollNumber": student.rollNumber }).populate("teacherId", "name");
      const teacherName = assignedClass ? assignedClass.teacherId.name : "Not Assigned";

      const attendanceLogs = await Attendance.find({ studentId: student._id })
        .sort({ date: -1 })
        .limit(10);
      
      const totalDays = await Attendance.countDocuments({ studentId: student._id });
      const presentDays = await Attendance.countDocuments({ studentId: student._id, status: "Present" });
      const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

      return res.json({
        role: "student",
        student,
        teacherName,
        attendancePercentage,
        attendanceLogs,
        pendingFees: Math.max(0, student.totalFees - student.feesPaid)
      });
    } else if (role === "teacher") {
      const teacherUser = await Teacher.findById(userId);
      const Class = require("../models/Class");
      if (!teacherUser) return res.status(404).json({ message: "Teacher record not found" });
      
      const teacherClasses = await Class.find({ teacherId: userId });
      const totalStudentsAssigned = teacherClasses.reduce((sum, c) => sum + c.students.length, 0);

      return res.json({
        role: "teacher",
        teacher: {
          name: teacherUser.name,
          salary: teacherUser.salary || 0,
          paidAmount: teacherUser.paidAmount || 0,
        },
        stats: {
          totalClasses: teacherClasses.length,
          totalStudents: totalStudentsAssigned
        }
      });
    }

  } catch (err) {
    next(err);
  }
};

const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Fee = require("../models/Fee");
const mongoose = require("mongoose");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const adminId = new mongoose.Types.ObjectId(req.admin.id);

    const totalStudents = await Student.countDocuments({ adminId });
    const totalAttendance = await Attendance.countDocuments({ adminId });
    const feeTransactionsCount = await Fee.countDocuments({ adminId });

    // Total revenue collected for this admin
    const revenueData = await Student.aggregate([
      { $match: { adminId } },
      { $group: { _id: null, totalRevenue: { $sum: "$feesPaid" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Pending fees for this admin
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

    // Course wise student counts for this admin
    const courseStats = await Student.aggregate([
      { $match: { adminId } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalStudents,
      totalAttendance,
      feeTransactionsCount,
      totalRevenue,
      totalPendingFees,
      courseStats
    });
  } catch (err) {
    next(err);
  }
};

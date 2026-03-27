const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

exports.markAttendance = async (req, res) => {
  const { studentId, date, status } = req.body;

  const exists = await Attendance.findOne({ studentId, date });

  if (exists) {
    return res.json({ msg: "Already marked" });
  }

  const record = new Attendance({ studentId, date, status });
  await record.save();

  res.json({ msg: "Saved" });
};

exports.getAttendance = async (req, res) => {
  const { date } = req.query;

  const data = await Attendance.find(date ? { date } : {})
    .populate("studentId", "name");

  res.json(data);
};


exports.getStats = async (req, res) => {
  const stats = await Attendance.aggregate([
    {
      $group: {
        _id: "$studentId",
        total: { $sum: 1 },
        present: {
          $sum: {
            $cond: [{ $eq: ["$status", "Present"] }, 1, 0]
          }
        }
      }
    },
    {
      $lookup: {
        from: "students",
        localField: "_id",
        foreignField: "_id",
        as: "student"
      }
    },
    { $unwind: "$student" },
    {
      $project: {
        name: "$student.name",
        percentage: {
          $multiply: [
            { $divide: ["$present", "$total"] },
            100
          ]
        }
      }
    }
  ]);

  res.json(stats);
};

exports.autoAbsent = async (req, res) => {
  try {

    const students = await Student.find();
    const today = new Date().toISOString().split("T")[0];

    for (let s of students) {

      const exists = await Attendance.findOne({
        studentId: s._id,
        date: today
      });

      if (!exists) {
        await Attendance.create({
          studentId: s._id,
          date: today,
          status: "Absent"
        });
      }
    }

    res.json({ msg: "Auto absent marked successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
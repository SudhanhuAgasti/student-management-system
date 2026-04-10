const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const mongoose = require("mongoose");

let studentCache = {};
let cacheExpiry = {};

const getCachedStudents = async (adminId) => {
  const key = adminId.toString();
  if (studentCache[key] && Date.now() < (cacheExpiry[key] || 0)) {
    return studentCache[key];
  }
  studentCache[key] = await Student.find({
    adminId,
    faceEmbedding: { $exists: true, $not: { $size: 0 } }
  });
  cacheExpiry[key] = Date.now() + 1000 * 60 * 5;
  return studentCache[key];
};

exports.markAttendance = async (req, res) => {
  const adminId = req.user.id;
  const { studentId, date, status } = req.body;

  const exists = await Attendance.findOne({ adminId, studentId, date });

  if (exists) {
    return res.json({ msg: "Already marked" });
  }

  const record = new Attendance({ adminId, studentId, date, status });
  await record.save();

  res.json({ msg: "Saved" });
};

exports.getAttendance = async (req, res) => {
  const adminId = req.user.id;
  const { date } = req.query;

  const query = date ? { adminId, date } : { adminId };
  const data = await Attendance.find(query).populate("studentId", "name");

  res.json(data);
};

exports.getStats = async (req, res) => {
  const adminId = new mongoose.Types.ObjectId(req.user.id);

  const stats = await Attendance.aggregate([
    { $match: { adminId } },
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
    const adminId = req.user.id;
    const students = await Student.find({ adminId });
    const today = new Date().toISOString().split("T")[0];

    for (let s of students) {
      const exists = await Attendance.findOne({
        adminId,
        studentId: s._id,
        date: today
      });

      if (!exists) {
        await Attendance.create({
          adminId,
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
};

exports.recognizeAndMarkAttendance = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { embedding } = req.body;
    const date = new Date().toISOString().split("T")[0];

    if (!embedding || !Array.isArray(embedding)) {
      return res.status(400).json({ msg: "Invalid embedding data" });
    }

    // Use per-admin cached students
    const students = await getCachedStudents(adminId);

    let bestMatch = null;
    let minDistance = 0.7;

    const euclideanDistance = (arr1, arr2) => {
      return Math.sqrt(
        arr1.reduce((sum, val, idx) => sum + Math.pow(val - arr2[idx], 2), 0)
      );
    };

    for (const student of students) {
      for (const stEmbedding of student.faceEmbedding) {
        const dist = euclideanDistance(embedding, stEmbedding);
        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = student;
        }
      }
    }

    if (!bestMatch) {
      return res.status(404).json({ msg: "Student not recognized" });
    }

    // Mark attendance for this admin
    const exists = await Attendance.findOne({ adminId, studentId: bestMatch._id, date });
    if (exists) {
      if (exists.status === "Present") {
        return res.json({ msg: `Attendance already marked for ${bestMatch.name}`, student: bestMatch });
      }
      exists.status = "Present";
      await exists.save();
    } else {
      const record = new Attendance({ adminId, studentId: bestMatch._id, date, status: "Present" });
      await record.save();
    }

    res.json({ msg: `Attendance marked for ${bestMatch.name}`, student: bestMatch });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

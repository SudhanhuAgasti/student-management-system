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
  const data = await Attendance.find(query).populate("studentId", "name parentPhone");

  res.json(data);
};

exports.getStats = async (req, res) => {
  try {
    const adminId = new mongoose.Types.ObjectId(req.user.id);

    const students = await Student.find({ adminId });
    const today = new Date();
    today.setHours(0,0,0,0);

    // Calculate working days excluding Sundays
    const getWorkingDays = (startDate, endDate) => {
      let count = 0;
      let cur = new Date(startDate);
      cur.setHours(0,0,0,0);
      let end = new Date(endDate);
      end.setHours(0,0,0,0);

      while (cur <= end) {
        if (cur.getDay() !== 0) count++; // Not Sunday
        cur.setDate(cur.getDate() + 1);
      }
      return count;
    };

    // Find all Present attendances for these students
    const presents = await Attendance.aggregate([
      { $match: { adminId, status: "Present" } },
      { $group: { _id: "$studentId", count: { $sum: 1 } } }
    ]);

    const presentMap = {};
    presents.forEach(p => {
      presentMap[p._id.toString()] = p.count;
    });

    const stats = students.map(student => {
      const workingDays = getWorkingDays(student.createdAt || student._id.getTimestamp(), today);
      const totalPresent = presentMap[student._id.toString()] || 0;
      
      let percentage = 0;
      if (workingDays > 0) {
        percentage = (totalPresent / workingDays) * 100;
      }

      return {
        _id: student._id,
        name: student.name,
        total: workingDays,
        present: totalPresent,
        percentage: percentage
      };
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

    // --- Time and Sunday Limitation Check ---
    // User requested Indian Standard Time limit: 10:00 AM to 10:30 AM, excluding Sundays
    const now = new Date();
    // To ensure it works regardless of server timezone, convert to IST:
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + istOffset);

    const currentDay = istTime.getDay();
    const currentHour = istTime.getHours();
    const currentMinute = istTime.getMinutes();

    if (currentDay === 0) {
      return res.status(403).json({ msg: "Today is Sunday! Attendance cannot be marked on holidays." });
    }

    // 2. Check Time Limit (Only allowed exactly between 10:00 AM and 10:30 AM)
    const isAllowedTime = (currentHour === 10 && currentMinute >= 0 && currentMinute <= 30);
    
    if (!isAllowedTime) {
      return res.status(403).json({ msg: "Attendance window closed! You can only mark attendance between 10:00 AM and 10:30 AM." });
    }
    // ----------------------------------------

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

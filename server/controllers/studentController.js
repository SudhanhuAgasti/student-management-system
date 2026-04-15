const Student = require("../models/Student");
const multer = require("multer");
const path = require("path");

// Multer Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });
exports.upload = upload;

exports.addStudent = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const admissionKey = "STU" + Math.floor(1000 + Math.random() * 9000).toString();
    
    // Now student is a top-level collection, role is student by default
    const student = new Student({ ...req.body, adminId, admissionKey });
    await student.save();

    res.status(201).json({
      message: "Student Added Successfully",
      admissionKey: admissionKey
    });
  } catch (err) {
    next(err);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const students = await Student.find({ adminId });
    res.json(students);
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const student = await Student.findOneAndDelete({ _id: req.params.id, adminId });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student Deleted Successfully" });
  } catch (err) {
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, adminId },
      req.body,
      { returnDocument: 'after' }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student Updated Successfully", student });
  } catch (err) {
    next(err);
  }
};

exports.registerFace = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { embedding } = req.body;
    const adminId = req.user.id;

    if (!embedding || !Array.isArray(embedding)) {
      return res.status(400).json({ message: "Invalid embedding data" });
    }

    const student = await Student.findOne({ _id: id, adminId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.faceEmbedding.push(embedding);
    await student.save();
    res.json({ message: "Face data registered successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getStudentProfile = async (req, res, next) => {
  try {
    // req.user.id is the student's ID from token
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student record not found" });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

exports.updateProfilePic = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Please upload an image" });

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { profilePic: `/uploads/${req.file.filename}` },
      { returnDocument: 'after' }
    );

    if (!student) return res.status(404).json({ message: "Student record not found" });

    res.json({
      message: "Profile picture updated successfully",
      profilePic: student.profilePic
    });
  } catch (err) {
    next(err);
  }
};

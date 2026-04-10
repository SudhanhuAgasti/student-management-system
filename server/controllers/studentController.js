const Student = require("../models/Student");

exports.addStudent = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    // Generate a unique 6-digit key for student registration
    const admissionKey = "STU" + Math.floor(1000 + Math.random() * 9000).toString();
    
    const student = new Student({ ...req.body, adminId, admissionKey });
    await student.save();

    res.status(201).json({
      message: "Student Added Successfully",
      admissionKey: admissionKey // Return this so admin can give it to student
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
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({
      message: "Student Deleted Successfully"
    });
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
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({
      message: "Student Updated Successfully",
      student
    });
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
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.faceEmbedding.push(embedding);
    await student.save();

    res.json({ message: "Face data registered successfully" });
  } catch (err) {
    next(err);
  }
};

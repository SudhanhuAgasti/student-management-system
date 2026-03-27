const Student = require("../models/Student");

exports.addStudent = async (req, res, next) => {
  try {
    const student = new Student(req.body);
    await student.save();

    res.status(201).json({
      message: "Student Added Successfully"
    });
  } catch (err) {
    next(err);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
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
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
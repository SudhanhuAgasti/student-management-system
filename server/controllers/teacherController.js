const Class = require("../models/Class");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Admin = require("../models/Admin");
const Note = require("../models/Note");
const OnlineClass = require("../models/OnlineClass");
const fs = require("fs");
const path = require("path");

exports.getClasses = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const classes = await Class.find({ teacherId }).sort({ createdAt: -1 });
    res.json(classes);
  } catch (err) {
    next(err);
  }
};

exports.getInstituteStudents = async (req, res, next) => {
  try {
    const adminId = req.user.adminId; // Coming from token decoded
    const students = await Student.find({ adminId });
    res.json(students);
  } catch (err) {
    next(err);
  }
};

exports.getInstituteClasses = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    
    // Fetch all teachers under this admin from Teacher collection (instead of User)
    const teachers = await Teacher.find({ adminId }).select('_id name email salary paidAmount');
    
    // Fetch all classes for these teachers
    const classes = await Class.find({ teacherId: { $in: teachers.map(t => t._id) } });
      
    // Group them manually
    const response = teachers.map(t => {
      return {
        teacher: t,
        classes: classes.filter(c => c.teacherId.toString() === t._id.toString())
      };
    });

    res.json(response);
  } catch (err) {
    next(err);
  }
};

exports.updateTeacherPayment = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const teacherId = req.params.teacherId;
    const { salary, paidAmount } = req.body;

    // Direct update in Teacher collection
    const teacher = await Teacher.findOne({ _id: teacherId, adminId });
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found or not authorized." });
    }

    if (salary !== undefined) teacher.salary = salary;
    if (paidAmount !== undefined) teacher.paidAmount = paidAmount;

    await teacher.save();

    res.json({ message: "Teacher payment details updated successfully", teacher });
  } catch (err) {
    next(err);
  }
};

exports.addClass = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { name, subject, schedule } = req.body;
    
    if (!name || !subject) {
      return res.status(400).json({ message: "Class name and subject are required" });
    }

    const newClass = new Class({ teacherId, name, subject, schedule });
    await newClass.save();
    
    res.status(201).json({ message: "Class created successfully", class: newClass });
  } catch (err) {
    next(err);
  }
};

exports.deleteClass = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    await Class.findOneAndDelete({ _id: req.params.id, teacherId });
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.addStudentToClass = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { name, rollNumber, grade } = req.body;
    
    const classRecord = await Class.findOne({ _id: req.params.id, teacherId });
    if (!classRecord) return res.status(404).json({ message: "Class not found" });

    classRecord.students.push({ name, rollNumber, grade });
    await classRecord.save();
    res.json({ message: "Student added to class", class: classRecord });
  } catch (err) {
    next(err);
  }
};

exports.removeStudentFromClass = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const classRecord = await Class.findOne({ _id: req.params.classId, teacherId });
    if (!classRecord) return res.status(404).json({ message: "Class not found" });

    classRecord.students = classRecord.students.filter(s => s._id.toString() !== req.params.studentId);
    await classRecord.save();
    res.json({ message: "Student removed from class", class: classRecord });
  } catch (err) {
    next(err);
  }
};

exports.getNotes = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const filter = { teacherId };
    if (req.query.classId) filter.classId = req.query.classId;
    const notes = await Note.find(filter).populate("classId", "name subject").sort({ uploadDate: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

exports.uploadNote = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { classId, title, description } = req.body;
    const teacherId = req.user.id;

    const newNote = new Note({
      teacherId,
      classId,
      title,
      description,
      fileUrl: req.file.path,
      originalFileName: req.file.originalname
    });

    await newNote.save();
    const populatedNote = await Note.findById(newNote._id).populate("classId", "name subject");
    res.status(201).json({ message: "Note uploaded successfully", note: populatedNote });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const note = await Note.findOne({ _id: req.params.id, teacherId });
    if (!note) return res.status(404).json({ message: "Note not found" });

    // With cloudinary, we can just delete from our DB. Cloudinary storage manages files independently 
    // unless we extract the public_id and call cloudinary.uploader.destroy. For simplicity, DB destruction.

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getOnlineClasses = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const classes = await OnlineClass.find({ teacherId }).populate("classId", "name subject").sort({ scheduledDate: -1 });
    res.json(classes);
  } catch (err) {
    next(err);
  }
};

exports.createOnlineClass = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { classId, title, meetLink, scheduledDate } = req.body;

    const onlineClass = new OnlineClass({ teacherId, classId, title, meetLink, scheduledDate });
    await onlineClass.save();
    const populated = await OnlineClass.findById(onlineClass._id).populate("classId", "name subject");
    res.status(201).json({ message: "Online class created", onlineClass: populated });
  } catch (err) {
    next(err);
  }
};

exports.deleteOnlineClass = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    await OnlineClass.findOneAndDelete({ _id: req.params.id, teacherId });
    res.json({ message: "Online class deleted" });
  } catch (err) {
    next(err);
  }
};

exports.getStudentContent = async (req, res, next) => {
  try {
    const studentId = req.user.id; // Student is logged in, their ID is in token
    
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student record not found" });

    const enrolledClasses = await Class.find({
      $or: [
        { "students.name": student.name },
        { "students.rollNumber": student.rollNumber }
      ]
    });

    const classIds = enrolledClasses.map(c => c._id);

    const notes = await Note.find({ classId: { $in: classIds } })
      .populate("teacherId", "name")
      .populate("classId", "name subject")
      .sort({ uploadDate: -1 });

    const onlineClasses = await OnlineClass.find({ 
      classId: { $in: classIds },
      isActive: true,
      scheduledDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })
      .populate("teacherId", "name")
      .populate("classId", "name subject")
      .sort({ scheduledDate: 1 });

    res.json({ notes, onlineClasses });
  } catch (err) {
    next(err);
  }
};

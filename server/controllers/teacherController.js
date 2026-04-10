const Class = require("../models/Class");
const Student = require("../models/Student");

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
    const adminRef = req.user.adminRef;
    if (!adminRef) {
      return res.status(403).json({ message: "No institution linked to your profile." });
    }
    const students = await Student.find({ adminId: adminRef });
    res.json(students);
  } catch (err) {
    next(err);
  }
};

exports.getInstituteClasses = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const User = require("../models/User");
    
    // Fetch all teachers under this admin
    const teachers = await User.find({ adminRef: adminId, role: "teacher" }).select('_id name email salary paidAmount');
    
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

    const User = require("../models/User");
    const teacher = await User.findOne({ _id: teacherId, adminRef: adminId, role: "teacher" });
    
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
    
    if (!name) {
      return res.status(400).json({ message: "Student name is required" });
    }

    const classRecord = await Class.findOne({ _id: req.params.id, teacherId });
    if (!classRecord) {
      return res.status(404).json({ message: "Class not found" });
    }

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
    const classId = req.params.classId;
    const studentId = req.params.studentId;

    const classRecord = await Class.findOne({ _id: classId, teacherId });
    if (!classRecord) {
      return res.status(404).json({ message: "Class not found" });
    }

    classRecord.students = classRecord.students.filter(s => s._id.toString() !== studentId);
    await classRecord.save();

    res.json({ message: "Student removed from class", class: classRecord });
  } catch (err) {
    next(err);
  }
};

const Note = require("../models/Note");
const fs = require("fs");
const path = require("path");

exports.getNotes = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    // Optionally filter by classId if passed
    const filter = { teacherId };
    if (req.query.classId) {
      filter.classId = req.query.classId;
    }
    const notes = await Note.find(filter).populate("classId", "name subject").sort({ uploadDate: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

exports.uploadNote = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { classId, title, description } = req.body;
    const teacherId = req.user.id;

    if (!classId || !title) {
      // Clean up file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Class ID and Title are required" });
    }

    const newNote = new Note({
      teacherId,
      classId,
      title,
      description,
      fileUrl: `/uploads/${req.file.filename}`,
      originalFileName: req.file.originalname
    });

    await newNote.save();
    
    // Return populated note for immediate UI rendering
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
    const noteId = req.params.id;

    const note = await Note.findOne({ _id: noteId, teacherId });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Try to delete physical file
    try {
      const filePath = path.join(__dirname, "..", note.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fsErr) {
      console.error("Failed to delete local file:", fsErr);
    }

    await Note.findByIdAndDelete(noteId);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// --- ONLINE CLASS CONTROLLERS ---
const OnlineClass = require("../models/OnlineClass");

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

    if (!classId || !title || !meetLink || !scheduledDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const onlineClass = new OnlineClass({
      teacherId,
      classId,
      title,
      meetLink,
      scheduledDate
    });

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

// --- STUDENT SPECIFIC CONTENT ---
exports.getStudentContent = async (req, res, next) => {
  try {
    const userId = req.user.id; // Student's user ID
    
    // Find student record to get their name/roll
    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    // Find all classes where this student is enrolled
    // Checking Class model students array for a match on name OR rollNumber
    // Ideally we'd match on student._id if the array stored ObjectIds, but it seems to store strings.
    const enrolledClasses = await Class.find({
      $or: [
        { "students.name": student.name },
        { "students.rollNumber": student.rollNumber }
      ]
    });

    const classIds = enrolledClasses.map(c => c._id);

    // Fetch notes for these classes
    const notes = await Note.find({ classId: { $in: classIds } })
      .populate("teacherId", "name")
      .populate("classId", "name subject")
      .sort({ uploadDate: -1 });

    // Fetch active online classes for these classes
    const onlineClasses = await OnlineClass.find({ 
      classId: { $in: classIds },
      isActive: true,
      scheduledDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Show classes from last 24h onwards
    })
      .populate("teacherId", "name")
      .populate("classId", "name subject")
      .sort({ scheduledDate: 1 });

    res.json({ notes, onlineClasses });
  } catch (err) {
    next(err);
  }
};

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true // Notes are usually associated with a specific class
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  fileUrl: {
    type: String, // The path to the PDF/File
    required: true
  },
  originalFileName: {
    type: String
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Note", noteSchema);

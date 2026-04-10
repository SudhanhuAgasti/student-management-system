const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  schedule: { type: String },
  students: [{
    name: String,
    rollNumber: String,
    grade: String
  }]
}, { timestamps: true });

module.exports = mongoose.model("Class", classSchema);

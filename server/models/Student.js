const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true // Only for registered students
  },
  password: {
    type: String
  },
  role: {
    type: String,
    default: "student"
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: [true, "Please enter your Phone Number!"],
    minlength: 10,
    maxlength: 10
  },

  course: String,

  feesPaid: {
    type: Number,
    default: 0
  },

  totalFees: Number,

  admissionDate: {
    type: Date,
    default: Date.now
  },

  rollNumber: {
    type: String,
  },

  profilePic: {
    type: String,
    default: ""
  },

  faceEmbedding: {
    type: [[Number]],
    default: []
  },
  admissionKey: {
    type: String,
    unique: true,
    sparse: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: String,
  otpExpires: Date
});

module.exports = mongoose.model("Student", studentSchema);
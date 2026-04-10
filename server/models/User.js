const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    default: "admin"
  },
  instituteCode: {
    type: String,
    unique: true,
    sparse: true
  },
  adminRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  salary: {
    type: Number,
    default: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: String,
  otpExpires: Date,
  admissionKey: String // Link to Student record's unique key
});

module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

  faceEmbedding: {
    type: [[Number]],
    default: []
  },
  admissionKey: {
    type: String,
    unique: true,
    sparse: true
  }
});

module.exports = mongoose.model("Student", studentSchema);
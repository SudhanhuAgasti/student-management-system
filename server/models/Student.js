const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  phone: String,

  course: String,

  feesPaid: {
    type: Number,
    default: 0
  },

  totalFees: Number,

  admissionDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Student", studentSchema);
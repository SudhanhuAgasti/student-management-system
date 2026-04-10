const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },

  amountPaid: {
    type: Number
  },

  paymentDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Fee", feeSchema);
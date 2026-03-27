const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
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
  }
});

module.exports = mongoose.model("Student", studentSchema);
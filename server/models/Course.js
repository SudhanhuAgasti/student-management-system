const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },

  name: String,
  duration: String,
  fees: Number
});

module.exports = mongoose.model("Course", courseSchema);
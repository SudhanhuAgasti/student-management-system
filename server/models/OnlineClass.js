const mongoose = require("mongoose");

const onlineClassSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  meetLink: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("OnlineClass", onlineClassSchema);

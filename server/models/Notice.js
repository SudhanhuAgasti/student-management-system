const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["general", "urgent", "event", "holiday"], 
    default: "general" 
  },
  postedBy: { type: String, default: "Admin" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notice", NoticeSchema);

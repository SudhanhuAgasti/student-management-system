const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");
const authMiddleware = require("../middleware/authMiddleware");

// Get all notices (recent first)
router.get("/notices", authMiddleware, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }).limit(10);
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Post a new notice (Admin only)
router.post("/notices", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { title, content, type } = req.body;
    const newNotice = new Notice({
      title,
      content,
      type,
      postedBy: req.user.name || "Admin"
    });

    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a notice (Admin only)
router.delete("/notices/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Notice deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

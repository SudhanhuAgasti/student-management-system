const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  markAttendance,
  getAttendance,
  getStats,
  autoAbsent,
  recognizeAndMarkAttendance
} = require("../controllers/attendanceController");
const { runAbsenceCheck } = require("../services/absenceReminder");

router.post("/attendance/recognize", authorizeRoles("admin", "teacher"), recognizeAndMarkAttendance);
router.get("/attendance", authorizeRoles("admin", "teacher", "student"), getAttendance);
router.get("/attendance/stats", authorizeRoles("admin", "teacher"), getStats);
router.get("/attendance/auto-absent", authorizeRoles("admin"), autoAbsent);

// Manual trigger for testing reminders
router.post("/attendance/trigger-reminders", authorizeRoles("admin"), async (req, res) => {
    try {
        const result = await runAbsenceCheck();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
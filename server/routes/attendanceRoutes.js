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

router.post("/attendance/recognize", authorizeRoles("admin", "teacher"), recognizeAndMarkAttendance);
router.get("/attendance", authorizeRoles("admin", "teacher", "student"), getAttendance);
router.get("/attendance/stats", authorizeRoles("admin", "teacher"), getStats);
router.get("/attendance/auto-absent", authorizeRoles("admin"), autoAbsent);

module.exports = router;
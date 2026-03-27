const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
  getStats,
  autoAbsent
} = require("../controllers/attendanceController");



router.post("/attendance", markAttendance);


router.get("/attendance", getAttendance);

router.get("/attendance/stats", getStats);

router.get("/attendance/auto-absent", autoAbsent);

module.exports = router;
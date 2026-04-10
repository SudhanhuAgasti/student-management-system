const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/roleMiddleware");
const { payFees, getFees, sendFeeReminders } = require("../controllers/feeController");

router.post("/payFees", authorizeRoles("admin"), payFees);
router.get("/fees", authorizeRoles("admin", "student"), getFees);
router.post("/fees/reminders", authorizeRoles("admin"), sendFeeReminders);

module.exports = router;
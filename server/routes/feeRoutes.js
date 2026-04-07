const express = require("express");
const router = express.Router();
const { payFees, getFees, sendFeeReminders } = require("../controllers/feeController");

router.post("/payFees", payFees);
router.get("/fees", getFees);
router.post("/fees/reminders", sendFeeReminders);

module.exports = router;
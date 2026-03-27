const express = require("express");
const router = express.Router();
const { payFees, getFees } = require("../controllers/feeController");

router.post("/payFees", payFees);
router.get("/fees", getFees);

module.exports = router;
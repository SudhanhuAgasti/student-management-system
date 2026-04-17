const express = require("express");
const router = express.Router();
const { loginAdmin, forgotPassword, verifyResetOTP, resetPassword } = require("../controllers/authController");

router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

module.exports = router;

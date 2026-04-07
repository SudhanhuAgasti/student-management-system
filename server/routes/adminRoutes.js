const express = require("express");

const router = express.Router();

const {
 registerAdmin,
 loginAdmin,
 verifyEmail
} = require("../controllers/adminController");

router.post("/register",registerAdmin);
router.post("/verify-email",verifyEmail);

router.post("/login",loginAdmin);

module.exports = router;
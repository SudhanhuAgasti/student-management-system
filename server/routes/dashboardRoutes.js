const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/roleMiddleware");
const { getDashboardStats } = require("../controllers/dashboardController");

router.get("/dashboard", authorizeRoles("admin", "teacher", "student"), getDashboardStats);

module.exports = router;
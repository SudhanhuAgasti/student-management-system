const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/roleMiddleware");
const { addCourse, getCourses, deleteCourse } = require("../controllers/courseController");

router.post("/addCourse", authorizeRoles("admin"), addCourse);
router.get("/courses", authorizeRoles("admin", "teacher", "student"), getCourses);
router.delete("/course/:id", authorizeRoles("admin"), deleteCourse);

module.exports = router;
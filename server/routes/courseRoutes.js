const express = require("express");
const router = express.Router();
const { addCourse, getCourses, deleteCourse } = require("../controllers/courseController");

router.post("/addCourse", addCourse);
router.get("/courses", getCourses);
router.delete("/course/:id", deleteCourse);

module.exports = router;
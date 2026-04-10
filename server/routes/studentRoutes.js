const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/roleMiddleware");
const {
  addStudent,
  getStudents,
  deleteStudent,
  updateStudent,
  registerFace
} = require("../controllers/studentController");

router.post("/addStudent", authorizeRoles("admin"), addStudent);
router.get("/students", authorizeRoles("admin", "teacher"), getStudents);
router.delete("/student/:id", authorizeRoles("admin"), deleteStudent);
router.put("/student/:id", authorizeRoles("admin", "teacher"), updateStudent);
router.post("/student/:id/face", authorizeRoles("admin", "teacher"), registerFace);

module.exports = router;
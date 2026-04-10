const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/roleMiddleware");
const {
  getClasses,
  addClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
  getInstituteStudents,
  getInstituteClasses,
  updateTeacherPayment,
  getNotes,
  uploadNote,
  deleteNote,
  getOnlineClasses,
  createOnlineClass,
  deleteOnlineClass,
  getStudentContent
} = require("../controllers/teacherController");

const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const fs = require("fs");
    const dir = "./uploads";
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.get("/admin/institute-classes", authorizeRoles("admin"), getInstituteClasses);
router.post("/admin/teacher-payment/:teacherId", authorizeRoles("admin"), updateTeacherPayment);

router.get("/teacher/classes", authorizeRoles("teacher"), getClasses);
router.get("/teacher/notes", authorizeRoles("teacher"), getNotes);
router.post("/teacher/notes", authorizeRoles("teacher"), upload.single("file"), uploadNote);
router.delete("/teacher/notes/:id", authorizeRoles("teacher"), deleteNote);
router.get("/teacher/institute-students", authorizeRoles("teacher"), getInstituteStudents);
router.post("/teacher/classes", authorizeRoles("teacher"), addClass);
router.delete("/teacher/classes/:id", authorizeRoles("teacher"), deleteClass);
router.post("/teacher/classes/:id/students", authorizeRoles("teacher"), addStudentToClass);
router.delete("/teacher/classes/:classId/students/:studentId", authorizeRoles("teacher"), removeStudentFromClass);

// Online classes
router.get("/teacher/online-classes", authorizeRoles("teacher"), getOnlineClasses);
router.post("/teacher/online-classes", authorizeRoles("teacher"), createOnlineClass);
router.delete("/teacher/online-classes/:id", authorizeRoles("teacher"), deleteOnlineClass);

// Student accessible content
router.get("/student/my-content", authorizeRoles("student"), getStudentContent);

module.exports = router;

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
  getStudentContent,
  deleteTeacher
} = require("../controllers/teacherController");

// Configure multer storage
const { uploadTeacherNote } = require("../config/cloudinary");
const upload = uploadTeacherNote;

router.get("/admin/institute-classes", authorizeRoles("admin"), getInstituteClasses);
router.post("/admin/teacher-payment/:teacherId", authorizeRoles("admin"), updateTeacherPayment);
router.delete("/admin/teachers/:teacherId", authorizeRoles("admin"), deleteTeacher);

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

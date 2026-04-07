const express = require("express");

const router = express.Router();

const {
 addStudent,
 getStudents,
 deleteStudent,
 updateStudent,
 registerFace
} = require("../controllers/studentController");

router.post("/addStudent",addStudent);

router.get("/students",getStudents);

router.delete("/student/:id",deleteStudent);

router.put("/student/:id",updateStudent);

router.post("/student/:id/face", registerFace);

module.exports = router;
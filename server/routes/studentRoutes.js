const express = require("express");

const router = express.Router();

const {
 addStudent,
 getStudents,
 deleteStudent,
 updateStudent
} = require("../controllers/studentController");

router.post("/addStudent",addStudent);

router.get("/students",getStudents);

router.delete("/student/:id",deleteStudent);

router.put("/student/:id",updateStudent);

module.exports = router;
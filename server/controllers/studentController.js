const Student = require("../models/Student");

exports.addStudent = async (req,res)=>{

  try{

    const student = new Student(req.body);

    await student.save();

    res.json({
      message:"Student Added Successfully"
    });

  }catch(err){

    res.status(500).json(err);

  }

};

exports.getStudents = async (req,res)=>{

  const students = await Student.find();

  res.json(students);

};

exports.deleteStudent = async (req,res)=>{

  await Student.findByIdAndDelete(req.params.id);

  res.json({
    message:"Student Deleted"
  });

};

exports.updateStudent = async (req,res)=>{

  await Student.findByIdAndUpdate(req.params.id,req.body);

  res.json({
    message:"Student Updated"
  });

};
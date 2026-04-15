const Admin = require("../models/Admin.js");
const Teacher = require("../models/Teacher.js");
const Student = require("../models/Student.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role, instituteCode, admissionKey } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    let resolvedAdminRef = null;
    let generatedInstituteCode = undefined;

    // Find if user already exists in ANY collection
    const checkAdmin = await Admin.findOne({ email });
    const checkTeacher = await Teacher.findOne({ email });
    const checkStudent = await Student.findOne({ email });
    
    const existingUser = checkAdmin || checkTeacher || checkStudent;

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists and is verified" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60000);

    let user;

    if (role === "admin") {
      generatedInstituteCode = "EDU" + Math.floor(1000 + Math.random() * 9000).toString();
      user = new Admin({ name, email, password: hashedPassword, role, instituteCode: generatedInstituteCode, otp, otpExpires });
    } else if (role === "teacher") {
      const adminOfInstitute = await Admin.findOne({ instituteCode });
      if (!adminOfInstitute) return res.status(404).json({ message: "Invalid Institute Code" });
      user = new Teacher({ name, email, password: hashedPassword, role, adminId: adminOfInstitute._id, otp, otpExpires });
    } else if (role === "student") {
      if (!admissionKey || !instituteCode) return res.status(400).json({ message: "Admission Key & Institute Code required" });
      const adminOfInstitute = await Admin.findOne({ instituteCode });
      if (!adminOfInstitute) return res.status(404).json({ message: "Invalid Institute Code" });
      
      // Check if student was pre-added by admin
      const studentMatch = await Student.findOne({ admissionKey, adminId: adminOfInstitute._id });
      if (!studentMatch) return res.status(403).json({ message: "Invalid Admission Key. Contact your Admin." });
      
      user = studentMatch;
      user.email = email;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();

    // Sends OTP Email (keeping your original email logic)
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your EduCore Account',
        text: `Your OTP for registration is: ${otp}. It is valid for 10 minutes.`,
      };
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
      } else {
        console.log(`[DEBUG OTP] OTP for ${email} is ${otp}`);
      }
    } catch (e) {}

    res.status(201).json({ message: "OTP sent to your email", email, isOtpSent: true });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    let user = await Admin.findOne({ email }) || await Teacher.findOne({ email }) || await Student.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password, instituteCode } = req.body;
    
    // Find user in any of the 3 collections
    let user = await Admin.findOne({ email }) || await Teacher.findOne({ email }) || await Student.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate institute code for students/teachers
    if (user.role !== "admin") {
      const adminOfInstitute = await Admin.findOne({ instituteCode });
      if (!adminOfInstitute || user.adminId?.toString() !== adminOfInstitute._id.toString()) {
        return res.status(403).json({ message: "Invalid Institute Code or Access Denied." });
      }
    }

    if (!user.isVerified) return res.status(403).json({ message: "Verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { 
        id: user._id, 
        name: user.name, 
        role: user.role,
        adminId: user.adminId || user._id
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Success",
      token,
      user: { id: user._id, name: user.name, role: user.role, adminId: user.adminId || user._id }
    });
  } catch (err) {
    next(err);
  }
};

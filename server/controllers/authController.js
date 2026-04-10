const User = require("../models/User.js");
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

    if (role === "admin") {
      generatedInstituteCode = "EDU" + Math.floor(1000 + Math.random() * 9000).toString();
    } else {
      if (!instituteCode) {
        return res.status(400).json({ message: "Institute Code is required for Teacher/Student registration." });
      }
      const adminUser = await User.findOne({ instituteCode, role: "admin" });
      if (!adminUser) {
        return res.status(404).json({ message: "Invalid Institute Code. Institute not found." });
      }
      resolvedAdminRef = adminUser._id;

      // --- NEW: ADMISSION KEY VALIDATION FOR STUDENTS ---
      if (role === "student") {
        if (!admissionKey) {
          return res.status(400).json({ message: "Admission Key is required for student registration." });
        }
        const Student = require("../models/Student");
        const studentMatch = await Student.findOne({ admissionKey, adminId: adminUser._id });
        if (!studentMatch) {
          return res.status(403).json({ message: "Invalid Admission Key. You must be added by the institute admin first." });
        }
        // Save the userId later during OTP verification or here if we want to link now
        // For now, we just proceed. We will link the userId in verifyEmail.
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists and is verified" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

    let user = existingUser;
    if (user) {
      user.name = name || user.name;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.isVerified = false;
      user.role = role || "admin";
      if (role === "admin" && !user.instituteCode) user.instituteCode = generatedInstituteCode;
      if (resolvedAdminRef) user.adminRef = resolvedAdminRef;
    } else {
      user = new User({
        name: name || "",
        email,
        password: hashedPassword,
        otp,
        otpExpires,
        isVerified: false,
        role: role || "admin",
        instituteCode: role === "admin" ? generatedInstituteCode : undefined,
        adminRef: resolvedAdminRef,
        admissionKey: role === "student" ? admissionKey : undefined
      });
    }

    await user.save();

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
        console.log(`[DEBUG OTP] (No email credentials) OTP for ${email} is ${otp}`);
      }
    } catch (emailErr) {
      console.error("Error sending email: ", emailErr);
    }

    res.status(201).json({
      message: "OTP sent to your email",
      email: email,
      isOtpSent: true
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // --- NEW: LINK USER TO STUDENT RECORD ON SUCCESSFUL VERIFICATION ---
    if (user.role === "student" && user.admissionKey) {
      const Student = require("../models/Student");
      // Find the student record with this key and update its userId
      await Student.findOneAndUpdate(
        { admissionKey: user.admissionKey, adminId: user.adminRef },
        { userId: user._id }
      );
    }

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password, instituteCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // --- REQUIRMENT: CROSS-CHECK INSTITUTE CODE FOR TEACHERS/STUDENTS ---
    if (user.role === "teacher" || user.role === "student") {
      if (!instituteCode) {
        return res.status(400).json({ message: "Institute Code is required for Teacher/Student login." });
      }

      // 1. Check if the institute (Admin) exists for this code
      const adminOfInstitute = await User.findOne({ instituteCode, role: "admin" });
      if (!adminOfInstitute) {
        return res.status(404).json({ message: "Invalid Institute Code. Institute does not exist." });
      }

      // 2. Security Check: Is this user actually registered under THIS institute?
      // Since user.adminRef stores the ID of the admin who owns the institute:
      if (user.adminRef.toString() !== adminOfInstitute._id.toString()) {
        return res.status(403).json({ message: "Access Denied. You are not registered with this Institute code." });
      }
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first before logging in"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        instituteCode: user.instituteCode,
        adminRef: user.adminRef
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        instituteCode: user.instituteCode,
        adminRef: user.adminRef
      }
    });
  } catch (err) {
    next(err);
  }
};

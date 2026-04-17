const Admin = require("../models/Admin.js");
const Teacher = require("../models/Teacher.js");
const Student = require("../models/Student.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOTPEmail = async (email, otp, type) => {
  const isForgot = type === "reset";
  const subject = isForgot ? "Reset Your Password - EduCore" : "Verify Your Account - EduCore";
  const title = isForgot ? "Password Reset Request" : "Welcome to EduCore!";
  const message = isForgot 
    ? "We received a request to reset your password. Use the code below to proceed." 
    : "Thank you for joining us! Please verify your email address to complete your registration.";

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background-color: #ffffff; border-radius: 20px; padding: 40px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em;">EduCore</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Institution Management System</p>
        </div>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 30px; text-align: center;">
          <h2 style="color: #1e293b; font-size: 20px; font-weight: 800; margin-bottom: 10px;">${title}</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">${message}</p>
          
          <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 30px; border: 2px dashed #cbd5e1;">
            <p style="color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.1em;">Your OTP Verification Code</p>
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 900; color: #4f46e5; letter-spacing: 12px; margin-left: 12px;">${otp}</span>
          </div>
          
          <p style="color: #94a3b8; font-size: 13px;">This code is valid for <b>10 minutes</b>. If you didn't request this, you can safely ignore this email.</p>
        </div>
        
        <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
          <p style="color: #adb5bd; font-size: 11px;">&copy; ${new Date().getFullYear()} EduCore Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"EduCore Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: htmlContent
      });
      console.log(`✅ [EMAIL SENT] ${type} OTP to ${email}`);
    }
  } catch (error) {
    console.error("❌ [EMAIL ERROR]:", error.message);
  }
};

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

    // Sends OTP Email
    try {
      console.log(`[DEBUG OTP] OTP for ${email} is ${otp}`);
      await sendOTPEmail(email, otp, "registration");
    } catch (e) {
      console.error("Error initiating email:", e.message);
    }

    res.status(201).json({ 
      message: "OTP sent to your email", 
      email, 
      isOtpSent: true, 
      instituteCode: generatedInstituteCode 
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    let user = await Admin.findOne({ email }) || await Teacher.findOne({ email }) || await Student.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp != otp || user.otpExpires < new Date()) {
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
        adminId: user.adminId || user._id,
        instituteCode: user.role === "admin" ? user.instituteCode : instituteCode
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
        role: user.role, 
        adminId: user.adminId || user._id,
        instituteCode: user.role === "admin" ? user.instituteCode : instituteCode
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(`📡 [API CALL] Forgot Password requested for: ${email}`);
    let user = await Admin.findOne({ email }) || await Teacher.findOne({ email }) || await Student.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found with this email" });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Sends OTP Email
    try {
      console.log("\n" + "=".repeat(50));
      console.log(`🔥 [FORGOT PASSWORD OTP] FOR: ${email}`);
      console.log(`🔢 OTP CODE: ${otp}`);
      console.log("=".repeat(50) + "\n");
      
      await sendOTPEmail(email, otp, "reset");
    } catch (e) {
      console.error("Error initiating email:", e.message);
    }

    res.json({ message: "Reset OTP sent to your email" });
  } catch (err) {
    next(err);
  }
};

exports.verifyResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    let user = await Admin.findOne({ email }) || await Teacher.findOne({ email }) || await Student.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified. Now enter your new password." });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    let user = await Admin.findOne({ email }) || await Teacher.findOne({ email }) || await Student.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now login." });
  } catch (err) {
    next(err);
  }
};

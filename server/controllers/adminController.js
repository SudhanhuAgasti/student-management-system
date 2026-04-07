const Admin = require("../models/Admin.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin && existingAdmin.isVerified) {
      return res.status(400).json({ message: "Admin already exists and is verified" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

    let admin = existingAdmin;
    if (admin) {
      admin.name = name || admin.name;
      admin.password = hashedPassword;
      admin.otp = otp;
      admin.otpExpires = otpExpires;
      admin.isVerified = false;
    } else {
      admin = new Admin({
        name: name || "",
        email,
        password: hashedPassword,
        otp,
        otpExpires,
        isVerified: false
      });
    }

    await admin.save();

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
        text: `Your OTP for admin registration is: ${otp}. It is valid for 10 minutes.`,
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

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.isVerified) {
      return res.status(400).json({ message: "Admin is already verified" });
    }

    if (admin.otp !== otp || admin.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    admin.isVerified = true;
    admin.otp = undefined;
    admin.otpExpires = undefined;
    await admin.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first before logging in"
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, name: admin.name, email: admin.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Success",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    next(err);
  }
};
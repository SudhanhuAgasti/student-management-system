require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

const createDefaultAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/coachingDB");
    console.log("Connected to MongoDB...");

    const email = "admin@educore.com";
    const password = "admin123";

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      email,
      password: hashedPassword,
      name: "Super Admin"
    });

    await admin.save();
    console.log("Default admin created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createDefaultAdmin();

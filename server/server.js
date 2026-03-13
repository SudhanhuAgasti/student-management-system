const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const feeRoutes = require("./routes/feeRoutes");
const courseRoutes = require("./routes/courseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);

// Protected routes
app.use("/api/admin", adminRoutes);
app.use("/api", authMiddleware, studentRoutes);
app.use("/api", authMiddleware, attendanceRoutes);
app.use("/api", authMiddleware, feeRoutes);
app.use("/api", authMiddleware, courseRoutes);
app.use("/api", authMiddleware, dashboardRoutes);

app.get("/",(req,res)=>{
  res.send("Coaching Management API Running");
});

// Use error handler middleware
app.use(errorHandler);

app.listen(5000,()=>{
 console.log("Server running on port 5000");
});

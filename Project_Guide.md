# 🎓 EduCore: Full-Stack Student Management & AI Attendance System

## 🌟 1. Overview
EduCore is a logic-driven, high-performance coaching management system. The primary goal is to eliminate manual entry and modernize institutions through **AI Face Recognition** and **Automated Parent Communication**.

---

## 🛠 2. Technical Stack (Deep Dive)

### 💻 Frontend (The Face)
- **React.js & Vite:** Ultrafast build tool and component-based architecture for modern web apps.
- **Tailwind CSS v4:** Used for the premium design system, glassmorphism UI, and custom animations.
- **Framer Motion:** Handles smooth page transitions and interactive element entry animations.
- **Lucide-React:** High-quality, scalable SVG icons throughout the portal.
- **Recharts & Chart.js:** Visual data representation for attendance and fee statistics.

### ⚙️ Backend (The Brain)
- **Node.js & Express:** Scalable and lightweight RESTful API server.
- **MongoDB & Mongoose:** NoSQL database for managing student data, attendance records, and transactions.
- **Face-api.js:** Browser-side AI computation that extracts 128 unique facial embeddings to verify identity.

### ☁️ Services & Utilities
- **Cloudinary:** Cloud-based media storage for secure profile picture management.
- **Node-Cron:** Automated background job service running daily at 11:05 AM for absence tracking.
- **jsPDF & AutoTable:** Advanced PDF generation for dynamic fee receipts and performance reports.

---

## 🚀 3. Core Functionality & Flow

### 🔑 A. Unified Multi-Role Authentication
- **Roles:** Admin, Teacher, Student.
- **Logic:** A single login portal identifies the user role and directs them to their respective tailored dashboard.
- **Security:** Implements JWT (JSON Web Tokens) for secure session management.

### 📸 B. Smart AI Attendance Flow
1. **Face Enrollment:** The Admin registers the student and captures their initial facial snapshot. The system converts this into a unique 128-float embedding.
2. **Recognition Window:** The portal allows attendance only between **10:00 AM and 10:30 AM** (IST), ensuring discipline.
3. **AI Verification:** The system compares the live webcam frame againt saved database embeddings using the **Euclidean Distance** algorithm.
4. **Proxy Protection:** Since it requires a live face and has a strict timer, proxy attendance is mathematically prevented.

### 🚨 C. Multi-Language Parent Alert System
- **Automated Check:** Every day after the attendance window closes, the server identifies absentees.
- **Communication Bridge:**
    *   **Manual Trigger:** Admin can manually notify parents with one click from the "Engagement Logs".
    *   **Multi-Lang Support:** Alerts are generated in **English, Hindi, and Odia**.
    *   **Urgency Tone:** Messages emphasize that regular attendance is critical for exam performance.

### 💰 D. Fee & Ledger Management
- **Defaulter Analytics:** A real-time dashboard showing students with pending dues.
- **Instant Reminders:** A direct WhatsApp button to send balance summaries to defaulters.
- **Digital receipts:** Verifiable PDF receipts generated instantly upon payment confirmation.

---

## ⚡ 4. Notable Implementation Highlights

- **Optimistic UI Updates:** Instant profile picture changes without waiting for server response, providing a fluid feel.
- **React Lazy Loading:** Uses `Suspense` to load code only when a specific page is visited, reducing initial bundle size by ~70%.
- **Global URL Context:** Centralized API management to ensure seamless performance between local development and production deployment.

---

## 🔄 5. System Workflow (User Journey)
1. **Admin** enrolls student and captures face.
2. **Teacher** uploads study materials and schedules classes.
3. **Student** marks attendance via Face ID -> System verifies identity.
4. **Automated Cron Job** detects absentees -> **Parent** receives WhatsApp alert.
5. **Admin** monitors the collection ledger and updates fee status.

---
© 2026 EduCore | Designed for Academic Excellence.

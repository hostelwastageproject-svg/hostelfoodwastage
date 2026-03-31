import express from "express";
import multer from "multer";

import {
    registerAdmin,
    loginAdmin,
    getAllAdmins,
    deleteAdmin,
    addAllowedEmail,
    uploadAllowedEmails
} from "../controllers/adminController.js";

<<<<<<< HEAD
import authMiddleware from "../middleware/authMiddleware.js";
=======
import { adminAuth } from "../middleware/adminAuth.js";
import { getAdminDashboard } from "../controllers/adminController.js";
>>>>>>> 545f0f7d2cb36fd1875f3d231f9dda8b0a20d819

const router = express.Router();

// Multer setup for XLSX uploads
const upload = multer({
    dest: "uploads/",   // folder to store the Excel file
});

// ==============================
// ADMIN ROUTES
// ==============================
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
<<<<<<< HEAD
router.get("/", authMiddleware, getAllAdmins);
router.delete("/:id", authMiddleware, deleteAdmin);
=======

router.get("/all", adminAuth, getAllAdmins);
router.delete("/:id", adminAuth, deleteAdmin);

// ==============================
// ALLOWED EMAIL ROUTES
// ==============================

// Add a single allowed email
router.post("/allowed-email/add", adminAuth, addAllowedEmail);

// Upload an Excel file to add multiple emails
router.post(
    "/allowed-email/upload",
    adminAuth,
    upload.single("file"),     // "file" is the form field name
    uploadAllowedEmails
);
import {
  // ...your existing imports
  getAttendancePresent,
  getAttendanceAbsent,
  getAttendanceSummary
} from "../controllers/adminController.js";

// Attendance routes (Admin only)
router.get("/attendance", adminAuth, getAttendancePresent);
router.get("/attendance/absent", adminAuth, getAttendanceAbsent);
router.get("/attendance/summary", adminAuth, getAttendanceSummary);
router.get("/dashboard", adminAuth, getAdminDashboard);
>>>>>>> 545f0f7d2cb36fd1875f3d231f9dda8b0a20d819

export default router;

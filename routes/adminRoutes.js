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

import { adminAuth } from "../middleware/adminAuth.js";

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

export default router;

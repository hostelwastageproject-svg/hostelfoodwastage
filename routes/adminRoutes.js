import express from "express";
import {
    registerAdmin,
    loginAdmin,
    getAllAdmins,
    deleteAdmin
} from "../controllers/adminController.js";

const router = express.Router();

// Routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/", getAllAdmins);
router.delete("/:id", deleteAdmin);

export default router;

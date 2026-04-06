import express from "express";
import { registerStaff, loginStaff, getAllStaff } from "../controllers/staffController.js";
import { staffAuth } from "../middleware/staffAuth.js";
import { markAttendance } from "../controllers/attendanceController.js";



import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.get("/", authMiddleware, getAllStaff);
router.post("/attendance/mark", staffAuth, markAttendance);

export default router;


import express from "express";
import { registerStaff, loginStaff, getAllStaff } from "../controllers/staffController.js";
import { staffAuth } from "../middleware/staffAuth.js";
import { markAttendance } from "../controllers/attendanceController.js";



const router = express.Router();

router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.get("/", getAllStaff);
router.post("/attendance/mark", staffAuth, markAttendance);

export default router;


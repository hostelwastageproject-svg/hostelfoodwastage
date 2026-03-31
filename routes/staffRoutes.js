import express from "express";
import { registerStaff, loginStaff, getAllStaff } from "../controllers/staffController.js";
import { staffAuth } from "../middleware/staffAuth.js";
import { markAttendance } from "../controllers/attendanceController.js";



import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerStaff);
router.post("/login", loginStaff);
<<<<<<< HEAD
router.get("/", authMiddleware, getAllStaff);
=======
router.get("/", getAllStaff);
router.post("/attendance/mark", staffAuth, markAttendance);
>>>>>>> 545f0f7d2cb36fd1875f3d231f9dda8b0a20d819

export default router;


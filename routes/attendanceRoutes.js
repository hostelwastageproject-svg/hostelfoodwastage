import express from "express";
import { markAttendance } from "../controllers/attendanceController.js";
import { staffAuth } from "../middleware/staffAuth.js";

const router = express.Router();

router.post("/mark", staffAuth, markAttendance);

export default router;

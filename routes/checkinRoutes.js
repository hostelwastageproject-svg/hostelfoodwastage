import express from "express";
import { createOrUpdateCheckin, getStudentCheckins } from "../controllers/checkinController.js";

const router = express.Router();

router.post("/", createOrUpdateCheckin);
router.get("/student/:student_id", getStudentCheckins);

export default router;

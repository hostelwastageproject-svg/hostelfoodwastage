import express from "express";
import { createNotice, getAllNotices } from "../controllers/noticeController.js";
import { staffAuth } from "../middleware/staffAuth.js";

const router = express.Router();

router.post("/create", staffAuth, createNotice);
router.get("/", getAllNotices);

export default router;
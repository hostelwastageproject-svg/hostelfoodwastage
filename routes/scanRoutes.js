import express from "express";
import { scanToken } from "../controllers/scanController.js";

const router = express.Router();

router.post("/", scanToken);   // POST /api/scan

export default router;

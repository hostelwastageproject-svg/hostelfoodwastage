import express from "express";
import { scanToken } from "../controllers/scanController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", scanToken);   // POST /api/scan

export default router;

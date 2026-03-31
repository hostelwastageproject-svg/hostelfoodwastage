import express from "express";
import {
  getDashboardStats,
  getRecentBookings
} from "../controllers/dashboardController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/stats", getDashboardStats);
router.get("/recent", getRecentBookings);

export default router;

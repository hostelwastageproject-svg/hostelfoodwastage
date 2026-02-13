import express from "express";
import {
  getDashboardStats,
  getRecentBookings
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/recent", getRecentBookings);

export default router;

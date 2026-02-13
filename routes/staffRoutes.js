import express from "express";
import { registerStaff, loginStaff, getAllStaff } from "../controllers/staffController.js";

const router = express.Router();

router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.get("/", getAllStaff);

export default router;


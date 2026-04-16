import express from "express";
import { 
    registerStudent, 
    loginStudent, 
    getAllStudents 
} from "../controllers/studentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/", authMiddleware, getAllStudents);

export default router;


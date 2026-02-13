import express from "express";
import { 
    registerStudent, 
    loginStudent, 
    getAllStudents 
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/", getAllStudents);

export default router;


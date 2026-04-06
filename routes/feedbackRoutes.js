import express from "express";
import multer from "multer";
import { submitFeedback, getFeedbackStats } from "../controllers/feedbackController.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/feedback",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
    }
});

const upload = multer({ storage });

router.post("/", upload.single("photo"), submitFeedback);
router.get("/stats", getFeedbackStats);

export default router;

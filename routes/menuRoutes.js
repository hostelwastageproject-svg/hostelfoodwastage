import express from "express";
import multer from "multer";
import { uploadMenu, getLatestMenu } from "../controllers/menuController.js";
import { staffAuth } from "../middleware/staffAuth.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/menu",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post("/upload", staffAuth, upload.single("file"), uploadMenu);
router.get("/latest", getLatestMenu);

export default router;
import express from "express";
import { generateBarcode } from "../controllers/barcodeController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// GET /api/barcode/:booking_id
router.get("/:booking_id", generateBarcode);

export default router;

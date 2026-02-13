import express from "express";
import { generateBarcode } from "../controllers/barcodeController.js";

const router = express.Router();

// GET /api/barcode/:booking_id
router.get("/:booking_id", generateBarcode);

export default router;

import bwipjs from "bwip-js";
import fs from "fs";
import path from "path";
import { sql } from "../db.js";

// Generate Barcode for Booking
export const generateBarcode = async (req, res) => {
    const { booking_id } = req.params;   // FIX → use params, not body

    try {
        // Validate booking
        const booking = await sql`
            SELECT * FROM bookings WHERE id = ${booking_id}
        `;

        if (booking.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Generate unique token
        const tokenValue = `TOKEN-${booking_id}-${Date.now()}`;

        // Generate barcode image using bwip-js
        const png = await bwipjs.toBuffer({
            bcid: "code128",
            text: tokenValue,
            scale: 3,
            height: 10,
            includetext: true,
            textxalign: "center",
        });

        // Ensure folder exists
        const folderPath = path.join("uploads", "barcodes");
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        // Save barcode image
        const fileName = `barcode_${booking_id}.png`;
        const filePath = path.join(folderPath, fileName);

        fs.writeFileSync(filePath, png);

        // Update booking with token number
        await sql`
            UPDATE bookings 
            SET token_number = ${tokenValue} 
            WHERE id = ${booking_id}
        `;

        res.json({
            message: "Barcode generated successfully",
            booking_id,
            token_number: tokenValue,
            barcode_url: `/uploads/barcodes/${fileName}`
        });

    } catch (error) {
        console.error("BARCODE GENERATION ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

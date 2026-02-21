import express from "express";
import {
    createBooking,
    bulkBooking,
    getAllBookings,
    getStudentBookings,
    updateBookingStatus,
    deleteBooking,
    cancelBooking
} from "../controllers/bookingController.js";

const router = express.Router();

// Create booking
router.post("/create", createBooking);

// Bulk booking
router.post("/bulk", bulkBooking);

// Cancel booking
router.put("/cancel/:id", cancelBooking);

// Get all bookings
router.get("/", getAllBookings);

// Get bookings by student
router.get("/:student_id", getStudentBookings);

// Update booking status
router.put("/status/:id", updateBookingStatus);

// Delete booking
router.delete("/:id", deleteBooking);

router.get("/token/:token_number", (req, res) => {
    const filePath = `tokens/token_${req.params.token_number}.pdf`;
    res.download(filePath);
});

export default router;
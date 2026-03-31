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

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

<<<<<<< HEAD
router.use(authMiddleware);

// Regular booking
=======
// Create booking
>>>>>>> 545f0f7d2cb36fd1875f3d231f9dda8b0a20d819
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
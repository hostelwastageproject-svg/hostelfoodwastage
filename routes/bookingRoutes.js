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

// Regular booking
router.post("/create", createBooking);

// Bulk booking
router.post("/bulk", bulkBooking);

// Cancel booking
router.put("/cancel/:id", cancelBooking);

// Other routes
router.get("/", getAllBookings);
router.get("/:student_id", getStudentBookings);
router.put("/status/:id", updateBookingStatus);
router.delete("/:id", deleteBooking);

export default router;

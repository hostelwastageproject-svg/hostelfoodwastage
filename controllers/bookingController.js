import { sql } from "../db.js";

// ===============================
// DAILY / PER-MEAL BOOKING
// ===============================
export const createBooking = async (req, res) => {
    const { student_id, reg_no, food_pref, meal_type, date } = req.body;

    try {
        if (!meal_type) {
            return res.status(400).json({ message: "meal_type is required" });
        }

        // Check student
        const student = await sql`
            SELECT * FROM students WHERE id = ${student_id}
        `;
        if (student.length === 0) {
            return res.status(400).json({ message: "Student does not exist" });
        }

        if (student[0].reg_no !== reg_no) {
            return res.status(400).json({ message: "Invalid student_id or reg_no" });
        }

        // Check duplicate
        const exists = await sql`
            SELECT * FROM bookings
            WHERE student_id = ${student_id}
            AND date = ${date}
            AND meal_type = ${meal_type}
        `;
        if (exists.length > 0) {
            return res.status(400).json({ message: "Booking already exists for this date and meal" });
        }

        // Create booking
        const newBooking = await sql`
            INSERT INTO bookings (student_id, reg_no, food_pref, meal_type, date, status)
            VALUES (${student_id}, ${reg_no}, ${food_pref}, ${meal_type}, ${date}, 'active')
            RETURNING *
        `;

        res.status(201).json(newBooking[0]);

    } catch (error) {
        console.error("CREATE BOOKING ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// BULK BOOKING (1–6 MONTHS)
// ===============================
export const bulkBooking = async (req, res) => {
    const { student_id, reg_no, food_pref, meal_type, start_date, end_date } = req.body;

    try {
        // Validate student
        const student = await sql`
            SELECT * FROM students WHERE id = ${student_id}
        `;
        if (student.length === 0) {
            return res.status(400).json({ message: "Student does not exist" });
        }

        if (student[0].reg_no !== reg_no) {
            return res.status(400).json({ message: "Invalid reg_no" });
        }

        // Validate date range
        const start = new Date(start_date);
        const end = new Date(end_date);

        if (isNaN(start) || isNaN(end) || start > end) {
            return res.status(400).json({ message: "Invalid date range" });
        }

        // 6-month limit
        const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6;
        if (end - start > sixMonths) {
            return res.status(400).json({ message: "Cannot book more than 6 months" });
        }

        let created = [];
        let skipped = [];
        let current = new Date(start);

        while (current <= end) {
            const dateStr = current.toISOString().split("T")[0];

            // Check duplicate
            const exists = await sql`
                SELECT * FROM bookings
                WHERE student_id = ${student_id}
                AND date = ${dateStr}
                AND meal_type = ${meal_type}
            `;

            if (exists.length > 0) {
                skipped.push(dateStr);
            } else {
                const booking = await sql`
                    INSERT INTO bookings (student_id, reg_no, food_pref, meal_type, date, status)
                    VALUES (${student_id}, ${reg_no}, ${food_pref}, ${meal_type}, ${dateStr}, 'active')
                    RETURNING *
                `;
                created.push(booking[0]);
            }

            current.setDate(current.getDate() + 1);
        }

        res.json({
            message: "Bulk booking completed",
            created_count: created.length,
            skipped_count: skipped.length,
            created,
            skipped
        });

    } catch (error) {
        console.error("BULK BOOKING ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// GET ALL BOOKINGS
// ===============================
export const getAllBookings = async (req, res) => {
    try {
        const rows = await sql`
            SELECT b.*, s.name
            FROM bookings b
            JOIN students s ON b.student_id = s.id
            ORDER BY b.id DESC
        `;
        res.json(rows);

    } catch (error) {
        console.error("FETCH BOOKINGS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// GET BOOKINGS FOR ONE STUDENT
// ===============================
export const getStudentBookings = async (req, res) => {
    const { student_id } = req.params;

    try {
        const rows = await sql`
            SELECT * FROM bookings
            WHERE student_id = ${student_id}
            ORDER BY id DESC
        `;
        res.json(rows);

    } catch (error) {
        console.error("FETCH STUDENT BOOKINGS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// UPDATE BOOKING STATUS
// ===============================
export const updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updated = await sql`
            UPDATE bookings
            SET status = ${status}
            WHERE id = ${id}
            RETURNING *
        `;

        if (updated.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(updated[0]);

    } catch (error) {
        console.error("UPDATE BOOKING ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// DELETE BOOKING
// ===============================
export const deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await sql`
            DELETE FROM bookings WHERE id = ${id}
            RETURNING *
        `;
        if (deleted.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json({ message: "Booking deleted successfully" });

    } catch (error) {
        console.error("DELETE BOOKING ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// CANCEL BOOKING (24-HOUR RULE)
// ===============================
export const cancelBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await sql`
            SELECT * FROM bookings WHERE id = ${id}
        `;

        if (booking.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking[0].status !== "active") {
            return res.status(400).json({ message: "Only active bookings can be cancelled" });
        }

        const bookingDate = new Date(booking[0].date);
        const now = new Date();
        const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
            return res.status(400).json({
                message: "Cannot cancel booking less than 24 hours before meal"
            });
        }

        await sql`
            UPDATE bookings
            SET status = 'cancelled'
            WHERE id = ${id}
        `;

        res.json({ message: "Booking cancelled successfully" });

    } catch (error) {
        console.error("CANCEL BOOKING ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

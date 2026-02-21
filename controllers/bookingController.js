import { sql } from "../db.js";
import { generateTokenPDF } from "../utils/pdfGenerator.js";

// ===============================
// DAILY / PER-MEAL BOOKING
// ===============================
export const createBooking = async (req, res) => {
    const { student_id, reg_no, food_pref, meal_type } = req.body;

    try {
        if (!student_id || !reg_no || !meal_type) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 🔥 MEAL CUTOFF TIME (10:00 PM)
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinutes;
        const cutoffTimeInMinutes = 22 * 60; // 10 PM

        if (currentTimeInMinutes >= cutoffTimeInMinutes) {
            return res.status(400).json({
                message: "Booking closed. Registration cutoff time is 10:00 PM."
            });
        }

        // 🔥 Automatically set booking date as TODAY
        const today = new Date().toLocaleDateString("en-CA");

        // 1️⃣ Check student
        const student = await sql`
            SELECT * FROM students WHERE id = ${student_id}
        `;

        if (student.length === 0) {
            return res.status(400).json({ message: "Student does not exist" });
        }

        if (student[0].reg_no !== reg_no) {
            return res.status(400).json({ message: "Invalid student_id or reg_no" });
        }

        // 2️⃣ Prevent duplicate booking
        const exists = await sql`
            SELECT * FROM bookings
            WHERE student_id = ${student_id}
            AND date = ${today}
            AND meal_type = ${meal_type}
        `;

        if (exists.length > 0) {
            return res.status(400).json({
                message: "Booking already exists for today"
            });
        }

        // 3️⃣ Generate token
        const token_number = `TOKEN-${student_id}-${Date.now()}`;

        // 4️⃣ Insert booking
        const newBooking = await sql`
            INSERT INTO bookings 
            (student_id, reg_no, food_pref, meal_type, date, status, token_number)
            VALUES 
            (${student_id}, ${reg_no}, ${food_pref}, ${meal_type}, ${today}, 'active', ${token_number})
            RETURNING *
        `;

        const booking = newBooking[0];

        // 5️⃣ Generate PDF
        const pdfPath = await generateTokenPDF({
            student_name: student[0].name,
            reg_no: reg_no,
            meal_type: meal_type,
            food_pref: food_pref,
            booking_date: today,
            booking_time: new Date().toLocaleTimeString(),
            token_number: token_number
        });

        return res.status(201).json({
            message: "Booking created successfully",
            booking,
            token_pdf: pdfPath
        });

    } catch (error) {
        console.error("CREATE BOOKING ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};
// ===============================
// BULK BOOKING (1–6 MONTHS)
// ===============================
export const bulkBooking = async (req, res) => {
    const { student_id, reg_no, food_pref, meal_type, start_date, end_date } = req.body;

    try {
        if (!student_id || !reg_no || !meal_type || !start_date || !end_date) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const student = await sql`
            SELECT * FROM students WHERE id = ${student_id}
        `;

        if (student.length === 0) {
            return res.status(400).json({ message: "Student does not exist" });
        }

        if (student[0].reg_no !== reg_no) {
            return res.status(400).json({ message: "Invalid reg_no" });
        }

        const start = new Date(start_date);
        const end = new Date(end_date);

        if (isNaN(start) || isNaN(end) || start > end) {
            return res.status(400).json({ message: "Invalid date range" });
        }

        let created = [];
        let skipped = [];
        let current = new Date(start);

        while (current <= end) {
            const dateStr = current.toISOString().split("T")[0];

            const exists = await sql`
                SELECT * FROM bookings
                WHERE student_id = ${student_id}
                AND date = ${dateStr}
                AND meal_type = ${meal_type}
            `;

            if (exists.length > 0) {
                skipped.push(dateStr);
            } else {
                const token_number = `TOKEN-${student_id}-${Date.now()}-${Math.floor(Math.random()*1000)}`;

                const booking = await sql`
                    INSERT INTO bookings
                    (student_id, reg_no, food_pref, meal_type, date, status, token_number)
                    VALUES
                    (${student_id}, ${reg_no}, ${food_pref}, ${meal_type}, ${dateStr}, 'active', ${token_number})
                    RETURNING *
                `;

                created.push(booking[0]);
            }

            current.setDate(current.getDate() + 1);
        }

        return res.json({
            message: "Bulk booking completed",
            created_count: created.length,
            skipped_count: skipped.length
        });

    } catch (error) {
        console.error("BULK BOOKING ERROR:", error);
        return res.status(500).json({ message: error.message });
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
        return res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: error.message });
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
        return res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: error.message });
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

        return res.json(updated[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
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

        return res.json({ message: "Booking deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ===============================
// CANCEL BOOKING
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

        await sql`
            UPDATE bookings
            SET status = 'cancelled'
            WHERE id = ${id}
        `;

        return res.json({ message: "Booking cancelled successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
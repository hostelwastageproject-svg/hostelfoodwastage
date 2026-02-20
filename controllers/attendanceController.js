import { sql } from "../db.js";

export const markAttendance = async (req, res) => {
    try {
        const { token_number } = req.body;

        if (!token_number) {
            return res.status(400).json({ message: "Token number is required" });
        }

        const staff_id = req.staff?.id;

        if (!staff_id) {
            return res.status(400).json({ message: "Staff authentication error" });
        }

        // Validate token (booking)
        const booking = await sql`
            SELECT * FROM bookings 
            WHERE token_number = ${token_number}
            LIMIT 1
        `;

        if (booking.length === 0) {
            return res.status(404).json({ message: "Invalid token" });
        }

        const record = booking[0];

        // Prevent duplicates
        const existing = await sql`
            SELECT * FROM attendance
            WHERE token_number = ${token_number}
            LIMIT 1
        `;

        if (existing.length > 0) {
            return res.status(400).json({ message: "Attendance already marked" });
        }

        // Insert attendance
        await sql`
            INSERT INTO attendance (token_number, student_id, staff_id)
            VALUES (${record.token_number}, ${record.student_id}, ${staff_id})
        `;

        res.json({
            message: "Attendance marked successfully",
            student_id: record.student_id,
            staff_id: staff_id,
            token_number,
        });

    } catch (error) {
        console.error("ATTENDANCE ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

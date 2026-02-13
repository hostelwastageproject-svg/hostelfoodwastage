import { sql } from "../db.js";

export const scanToken = async (req, res) => {
  const { token } = req.body;

  try {
    // 1️⃣ Find booking by token
    const booking = await sql`
      SELECT b.*, s.name AS student_name, s.reg_no
      FROM bookings b
      JOIN students s ON b.student_id = s.id
      WHERE b.token = ${token}
    `;

    if (booking.length === 0) {
      return res.json({
        status: "invalid",
        message: "Invalid token. No booking found."
      });
    }

    const record = booking[0];

    // 2️⃣ Check if token already used
    const previousScan = await sql`
      SELECT * FROM meal_attendance
      WHERE booking_id = ${record.id}
    `;

    if (previousScan.length > 0) {
      return res.json({
        status: "duplicate",
        message: "Token already used!",
        student: {
          name: record.student_name,
          reg_no: record.reg_no,
          meal_type: record.meal_type,
          date: record.date
        }
      });
    }

    // 3️⃣ First-time scan → Insert into attendance log
    await sql`
      INSERT INTO meal_attendance (booking_id, status)
      VALUES (${record.id}, 'valid')
    `;

    // 4️⃣ Return success
    return res.json({
      status: "valid",
      message: "Meal attendance recorded successfully.",
      student: {
        name: record.student_name,
        reg_no: record.reg_no,
        meal_type: record.meal_type,
        date: record.date
      }
    });

  } catch (err) {
    console.error("SCAN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

import { sql } from "../db.js";

export const scanToken = async (req, res) => {
  const { token_number } = req.body; // barcode sends token_number

  try {
    if (!token_number) {
      return res.json({
        status: "error",
        message: "token_number is required."
      });
    }

    // 1️⃣ Find booking by token_number
    const booking = await sql`
      SELECT 
        b.*, 
        s.name AS student_name, 
        s.reg_no
      FROM bookings b
      JOIN students s 
        ON b.student_id = s.id
      WHERE b.token_number = ${token_number}
    `;

    if (booking.length === 0) {
      return res.json({
        status: "invalid",
        message: "Invalid token. No booking found."
      });
    }

    const record = booking[0];

    // 2️⃣ Check if token already scanned
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

    // 3️⃣ Insert attendance on first scan
    await sql`
      INSERT INTO meal_attendance (booking_id, status)
      VALUES (${record.id}, 'valid')
    `;

    // 4️⃣ Successful scan
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

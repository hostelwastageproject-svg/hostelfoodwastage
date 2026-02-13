import { sql } from "../db.js";

// ==============================
// ADMIN DASHBOARD STATS
// ==============================
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await sql`SELECT COUNT(*) FROM students`;
    const totalBookings = await sql`SELECT COUNT(*) FROM bookings`;

    const todayBookings = await sql`
      SELECT COUNT(*)
      FROM bookings
      WHERE date = CURRENT_DATE
    `;

    const mealType = await sql`
      SELECT meal_type, COUNT(*) 
      FROM bookings 
      GROUP BY meal_type
    `;

    const activeBookings = await sql`
      SELECT COUNT(*) FROM bookings WHERE status = 'active'
    `;

    const cancelledBookings = await sql`
      SELECT COUNT(*) FROM bookings WHERE status = 'cancelled'
    `;

    res.json({
      total_students: totalStudents[0].count,
      total_bookings: totalBookings[0].count,
      todays_bookings: todayBookings[0].count,
      meal_breakdown: mealType,
      active: activeBookings[0].count,
      cancelled: cancelledBookings[0].count
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// RECENT BOOKINGS (last 10)
// ==============================
export const getRecentBookings = async (req, res) => {
  try {
    const recent = await sql`
      SELECT 
        b.id,
        b.meal_type,
        b.date,
        b.status,
        b.created_at,
        s.name AS student_name,
        s.reg_no AS reg_no
      FROM bookings b
      JOIN students s ON b.student_id = s.id
      ORDER BY b.created_at DESC
      LIMIT 10
    `;

    res.json(recent);

  } catch (err) {
    console.error("Recent Booking Error:", err);
    res.status(500).json({ message: err.message });
  }
};


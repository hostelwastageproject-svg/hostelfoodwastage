import { sql } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import xlsx from "xlsx";

// ==============================
// REGISTER ADMIN
// ==============================
export const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const exists = await sql`SELECT * FROM admin WHERE email = ${email}`;
        if (exists.length > 0) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const newAdmin = await sql`
            INSERT INTO admin (name, email, password)
            VALUES (${name}, ${email}, ${hashed})
            RETURNING id, name, email, created_at
        `;

        res.status(201).json(newAdmin[0]);
    } catch (error) {
        console.error("REGISTER ADMIN ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ==============================
// LOGIN ADMIN
// ==============================
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await sql`SELECT * FROM admin WHERE email = ${email}`;
        if (result.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const admin = result[0];

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({ token });
    } catch (error) {
        console.error("LOGIN ADMIN ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ==============================
// GET ALL ADMINS
// ==============================
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await sql`
            SELECT id, name, email, created_at FROM admin ORDER BY id DESC
        `;
        res.json(admins);
    } catch (error) {
        console.error("FETCH ADMINS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ==============================
// DELETE ADMIN
// ==============================
export const deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await sql`
            DELETE FROM admin WHERE id = ${id} RETURNING *
        `;

        if (deleted.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({ message: "Admin deleted successfully" });
    } catch (error) {
        console.error("DELETE ADMIN ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ==============================
// ADD SINGLE ALLOWED EMAIL
// ==============================
export const addAllowedEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const exists = await sql`
            SELECT * FROM allowed_emails WHERE email = ${email}
        `;
        if (exists.length > 0) {
            return res.status(400).json({ message: "Email already allowed" });
        }

        const added = await sql`
            INSERT INTO allowed_emails (email)
            VALUES (${email})
            RETURNING *
        `;

        res.json({
            message: "Email added to allowed list",
            email: added[0]
        });

    } catch (error) {
        console.error("ADD ALLOWED EMAIL ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ==============================
// UPLOAD XLSX → INSERT BULK EMAILS
// ==============================
export const uploadAllowedEmails = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Read Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(sheet);

        if (rows.length === 0) {
            return res.status(400).json({ message: "Excel file is empty" });
        }

        let inserted = 0;
        let duplicates = 0;

        for (const row of rows) {
            const email = row.email || row.Email || row.EMAIL;

            if (!email) continue;

            const exists = await sql`
                SELECT * FROM allowed_emails WHERE email = ${email}
            `;

            if (exists.length > 0) {
                duplicates++;
                continue;
            }

            await sql`
                INSERT INTO allowed_emails (email)
                VALUES (${email})
            `;

            inserted++;
        }

        res.json({
            message: "Excel processed successfully",
            inserted,
            duplicates
        });

    } catch (error) {
        console.error("UPLOAD XLSX ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};
// ==============================
// ADMIN - PRESENT ATTENDANCE LIST
// GET /api/admin/attendance?date=YYYY-MM-DD&meal_type=lunch
// ==============================
export const getAttendancePresent = async (req, res) => {
    try {
        const { date, meal_type } = req.query;

        if (!date || !meal_type) {
            return res.status(400).json({ message: "date and meal_type are required" });
        }

        const rows = await sql`
            SELECT 
                b.id AS booking_id,
                b.date,
                b.meal_type,
                b.food_pref,
                b.reg_no,
                s.name AS student_name,
                ma.scanned_at
            FROM bookings b
            JOIN students s ON s.id = b.student_id
            JOIN meal_attendance ma ON ma.booking_id = b.id
            WHERE b.date = ${date}
              AND b.meal_type = ${meal_type}
            ORDER BY ma.scanned_at DESC
        `;

        return res.json({
            message: "Present attendance fetched",
            count: rows.length,
            data: rows
        });

    } catch (error) {
        console.error("GET PRESENT ATTENDANCE ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};

// ==============================
// ADMIN - ABSENT LIST (Booked but not scanned)
// GET /api/admin/attendance/absent?date=YYYY-MM-DD&meal_type=lunch
// ==============================
export const getAttendanceAbsent = async (req, res) => {
    try {
        const { date, meal_type } = req.query;

        if (!date || !meal_type) {
            return res.status(400).json({ message: "date and meal_type are required" });
        }

        const rows = await sql`
            SELECT
                b.id AS booking_id,
                b.date,
                b.meal_type,
                b.food_pref,
                b.reg_no,
                b.token_number,
                s.name AS student_name
            FROM bookings b
            JOIN students s ON s.id = b.student_id
            LEFT JOIN meal_attendance ma ON ma.booking_id = b.id
            WHERE b.date = ${date}
              AND b.meal_type = ${meal_type}
              AND b.status = 'active'
              AND ma.booking_id IS NULL
            ORDER BY b.id DESC
        `;

        return res.json({
            message: "Absent list fetched",
            count: rows.length,
            data: rows
        });

    } catch (error) {
        console.error("GET ABSENT LIST ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};

// ==============================
// ADMIN - SUMMARY
// GET /api/admin/attendance/summary?date=YYYY-MM-DD&meal_type=lunch
// ==============================
export const getAttendanceSummary = async (req, res) => {
    try {
        const { date, meal_type } = req.query;

        if (!date || !meal_type) {
            return res.status(400).json({ message: "date and meal_type are required" });
        }

        const bookedRows = await sql`
            SELECT COUNT(*)::int AS total_booked
            FROM bookings
            WHERE date = ${date}
              AND meal_type = ${meal_type}
              AND status = 'active'
        `;

        const presentRows = await sql`
            SELECT COUNT(*)::int AS total_present
            FROM bookings b
            JOIN meal_attendance ma ON ma.booking_id = b.id
            WHERE b.date = ${date}
              AND b.meal_type = ${meal_type}
              AND b.status = 'active'
        `;

        const total_booked = bookedRows[0]?.total_booked || 0;
        const total_present = presentRows[0]?.total_present || 0;
        const total_absent = total_booked - total_present;

        return res.json({
            message: "Attendance summary fetched",
            date,
            meal_type,
            total_booked,
            total_present,
            total_absent
        });

    } catch (error) {
        console.error("GET SUMMARY ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};
// ==============================
// ADMIN DASHBOARD
// ==============================
export const getAdminDashboard = async (req, res) => {
    try {

        const today = new Date().toLocaleDateString("en-CA");

        // Total Students
        const students = await sql`
            SELECT COUNT(*)::int AS total FROM students
        `;

        // Total Staff
        const staff = await sql`
            SELECT COUNT(*)::int AS total FROM staff
        `;

        // Today Bookings (meal-wise)
        const bookings = await sql`
            SELECT meal_type, COUNT(*)::int AS count
            FROM bookings
            WHERE date = ${today}
              AND status = 'active'
            GROUP BY meal_type
        `;

        // Today Attendance (meal-wise)
        const attendance = await sql`
            SELECT b.meal_type, COUNT(*)::int AS count
            FROM bookings b
            JOIN meal_attendance ma ON ma.booking_id = b.id
            WHERE b.date = ${today}
              AND b.status = 'active'
            GROUP BY b.meal_type
        `;

        // Format meal-wise results
        const mealTypes = ["breakfast", "lunch", "dinner"];

        const today_bookings = {};
        const today_attendance = {};
        const today_absent = {};

        mealTypes.forEach(meal => {
            const bookingRow = bookings.find(b => b.meal_type === meal);
            const attendanceRow = attendance.find(a => a.meal_type === meal);

            const totalBooked = bookingRow ? bookingRow.count : 0;
            const totalPresent = attendanceRow ? attendanceRow.count : 0;

            today_bookings[meal] = totalBooked;
            today_attendance[meal] = totalPresent;
            today_absent[meal] = totalBooked - totalPresent;
        });

        return res.json({
            total_students: students[0].total,
            total_staff: staff[0].total,
            today_bookings,
            today_attendance,
            today_absent
        });

    } catch (error) {
        console.error("DASHBOARD ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};

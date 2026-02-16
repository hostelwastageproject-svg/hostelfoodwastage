import { sql } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ======================================================
// REGISTER STUDENT (Only allowed emails + auto reg_no)
// ======================================================
export const registerStudent = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required (name, email, password)"
        });
    }

    try {
        // 1. VALIDATE EMAIL DOMAIN
        if (!email.endsWith("@klu.ac.in")) {
            return res.status(400).json({
                message: "Only KLU email addresses are allowed"
            });
        }

        // 2. AUTO EXTRACT REG NO
        const reg_no = email.split("@")[0];

        // Validate reg_no is 10 or 11 digit number
        if (!/^\d{10,11}$/.test(reg_no)) {
            return res.status(400).json({
                message: "Invalid KLU email format: reg_no must be 10 or 11 digits"
            });
        }

        // 3. CHECK IF EMAIL IS ALLOWED (hostel admin decides)
        const allowed = await sql`
            SELECT * FROM allowed_emails WHERE email = ${email}
        `;

        if (allowed.length === 0) {
            return res.status(403).json({
                message: "This email is not approved for hostel registration"
            });
        }

        // 4. CHECK IF STUDENT ALREADY EXISTS
        const exists = await sql`
            SELECT * FROM students WHERE email = ${email}
        `;

        if (exists.length > 0) {
            return res.status(400).json({ message: "Student already exists" });
        }

        // 5. HASH PASSWORD
        const hashed = await bcrypt.hash(password, 10);

        // 6. INSERT STUDENT
        const newStudent = await sql`
            INSERT INTO students (name, email, password, reg_no)
            VALUES (${name}, ${email}, ${hashed}, ${reg_no})
            RETURNING id, name, email, reg_no, created_at
        `;

        res.status(201).json({
            message: "Student registered successfully",
            student: newStudent[0]
        });

    } catch (error) {
        console.error("REGISTER STUDENT ERROR:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ======================================================
// LOGIN STUDENT
// ======================================================
export const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    try {
        const studentData = await sql`
            SELECT * FROM students WHERE email = ${email}
        `;

        if (studentData.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const student = studentData[0];

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: student.id, email: student.email, reg_no: student.reg_no },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error("LOGIN STUDENT ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ======================================================
// GET ALL STUDENTS
// ======================================================
export const getAllStudents = async (req, res) => {
    try {
        const students = await sql`
            SELECT id, name, email, reg_no, created_at 
            FROM students 
            ORDER BY id DESC
        `;

        res.json(students);

    } catch (error) {
        console.error("FETCH STUDENTS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

import { sql } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER STUDENT
export const registerStudent = async (req, res) => {
    const { name, email, password, reg_no } = req.body;

    if (!name || !email || !password || !reg_no) {
        return res.status(400).json({ message: "All fields are required (name, email, password, reg_no)" });
    }

    try {
        const exists = await sql`
            SELECT * FROM students WHERE email = ${email}
        `;

        if (exists.length > 0) {
            return res.status(400).json({ message: "Student already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const newStudent = await sql`
            INSERT INTO students (name, email, password, reg_no)
            VALUES (${name}, ${email}, ${hashed}, ${reg_no})
            RETURNING *
        `;

        res.status(201).json(newStudent[0]);
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};


// LOGIN STUDENT
export const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await sql`
            SELECT * FROM students WHERE email = ${email}
        `;

        if (result.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const student = result[0];

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: student.id, email: student.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};


// GET ALL STUDENTS
export const getAllStudents = async (req, res) => {
    try {
        const students = await sql`
            SELECT * FROM students ORDER BY id DESC
        `;

        res.json(students);
    } catch (error) {
        console.error("FETCH STUDENTS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};


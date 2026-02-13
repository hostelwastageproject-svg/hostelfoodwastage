import { sql } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register Staff
export const registerStaff = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const exists = await sql`
            SELECT * FROM staff WHERE email = ${email}
        `;

        if (exists.length > 0) {
            return res.status(400).json({ message: "Staff already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const newStaff = await sql`
            INSERT INTO staff (name, email, password, role)
            VALUES (${name}, ${email}, ${hashed}, ${role})
            RETURNING id, name, email, role
        `;

        res.status(201).json(newStaff[0]);
    } catch (error) {
        console.error("REGISTER STAFF ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// Login Staff
export const loginStaff = async (req, res) => {
    const { email, password } = req.body;

    try {
        const staff = await sql`
            SELECT * FROM staff WHERE email = ${email}
        `;

        if (staff.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = staff[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        console.error("LOGIN STAFF ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get ALL Staff
export const getAllStaff = async (req, res) => {
    try {
        const staff = await sql`
            SELECT id, name, email, role, created_at 
            FROM staff ORDER BY id DESC
        `;
        res.json(staff);
    } catch (error) {
        console.error("GET STAFF ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

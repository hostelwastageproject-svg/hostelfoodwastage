import { sql } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ==============================
// REGISTER ADMIN
// ==============================
export const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const exists = await sql`
            SELECT * FROM admin WHERE email = ${email}
        `;

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
        const result = await sql`
            SELECT * FROM admin WHERE email = ${email}
        `;

        if (result.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const admin = result[0];

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

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

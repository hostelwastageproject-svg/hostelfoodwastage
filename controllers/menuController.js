import { sql } from "../db.js";
import path from "path";

export const uploadMenu = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = `/uploads/menu/${req.file.filename}`;

        const result = await sql`
            INSERT INTO menus (file_name, file_path, uploaded_by)
            VALUES (${req.file.originalname}, ${filePath}, ${req.staff.id})
            RETURNING *
        `;

        res.json({
            message: "Menu uploaded successfully",
            menu: result[0]
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLatestMenu = async (req, res) => {
    try {
        const menu = await sql`
            SELECT * FROM menus
            ORDER BY created_at DESC
            LIMIT 1
        `;

        if (menu.length === 0) {
            return res.status(404).json({ message: "No menu uploaded yet" });
        }

        res.json(menu[0]);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
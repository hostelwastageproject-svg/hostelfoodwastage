import { sql } from "../db.js";

export const createNotice = async (req, res) => {
    const { title, message } = req.body;

    try {
        if (!title || !message) {
            return res.status(400).json({ message: "Title and message required" });
        }

        const result = await sql`
            INSERT INTO notices (title, message, created_by)
            VALUES (${title}, ${message}, ${req.staff.id})
            RETURNING *
        `;

        res.json({
            message: "Notice created successfully",
            notice: result[0]
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllNotices = async (req, res) => {
    try {
        const notices = await sql`
            SELECT * FROM notices
            ORDER BY created_at DESC
        `;
        res.json(notices);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
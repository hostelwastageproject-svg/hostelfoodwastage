import { sql } from "../db.js";

// ===============================
// SUBMIT FEEDBACK
// ===============================
export const submitFeedback = async (req, res) => {
    let { student_id, meal_type, rating } = req.body;
    
    // Convert text inputs
    rating = parseInt(rating, 10);

    try {
        if (!student_id || !meal_type || !rating) {
            return res.status(400).json({ message: "Student ID, meal type, and rating are required." });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5." });
        }

        let photo_url = null;
        if (req.file) {
            photo_url = `/uploads/feedback/${req.file.filename}`;
        }

        const newFeedback = await sql`
            INSERT INTO feedbacks (student_id, meal_type, rating, photo_url)
            VALUES (${student_id}, ${meal_type}, ${rating}, ${photo_url})
            RETURNING *
        `;

        return res.status(201).json({
            message: "Feedback submitted successfully!",
            feedback: newFeedback[0]
        });

    } catch (error) {
        console.error("SUBMIT FEEDBACK ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};

// ===============================
// GET FEEDBACK STATS FOR MENU
// ===============================
export const getFeedbackStats = async (req, res) => {
    try {
        // Simple aggregate: get average rating for each meal type
        const stats = await sql`
            SELECT meal_type, ROUND(AVG(rating), 1) as avg_rating, COUNT(*) as review_count
            FROM feedbacks
            GROUP BY meal_type
        `;

        const recent_photos = await sql`
            SELECT id, meal_type, photo_url, created_at
            FROM feedbacks
            WHERE photo_url IS NOT NULL
            ORDER BY created_at DESC
            LIMIT 10
        `;

        res.json({
            stats,
            recent_photos
        });
    } catch (error) {
        console.error("GET FEEDBACK STATS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

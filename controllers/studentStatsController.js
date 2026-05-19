import { sql } from "../db.js";

export const getDashboardStats = async (req, res) => {
    const { student_id } = req.query;

    try {
        // Hostel-wide statistics
        const today = new Date().toISOString().split('T')[0];
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = yesterdayDate.toISOString().split('T')[0];

        // Let's see how many opted out yesterday
        const optOuts = await sql`
            SELECT COUNT(*) FROM checkins
            WHERE date = ${yesterday} AND status = 'opted_out'
        `;
        const optedOutCount = parseInt(optOuts[0].count);

        const totalStudentsResult = await sql`SELECT COUNT(*) FROM students`;
        const totalStudents = parseInt(totalStudentsResult[0].count) || 1; // avoid division by 0
        
        // Estimate saved kg. E.g., 0.5 kg per opt-out
        const savedFoodKg = optedOutCount * 0.5;
        
        // Checkin percentage
        const checkinCountResult = await sql`
            SELECT COUNT(DISTINCT student_id) FROM checkins 
            WHERE date = ${yesterday} AND status IN ('confirmed', 'opted_out')
        `;
        const checkinCount = parseInt(checkinCountResult[0].count);
        const checkinPercentage = Math.round((checkinCount / totalStudents) * 100);

        const hostelStats = {
            checkinPercentage,
            savedFoodKg
        };

        let individualStats = null;
        if (student_id) {
            const studentInfo = await sql`
                SELECT streak_count, last_checkin_date 
                FROM students 
                WHERE id = ${student_id}
            `;
            if (studentInfo.length > 0) {
                // If the user's streak is active, calculate saving (e.g. 0.5kg per day active)
                const savedByMe = (studentInfo[0].streak_count || 0) * 0.5;
                individualStats = {
                    streak: studentInfo[0].streak_count || 0,
                    savedByMe
                };
            }
        }

        res.json({
            hostelStats,
            individualStats
        });

    } catch (error) {
        console.error("DASHBOARD STATS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

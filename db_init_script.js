import dotenv from "dotenv";
dotenv.config();
import { sql } from "./db.js";

async function initializeDB() {
    try {
        console.log("Starting DB Initialization...");

        // 1. Alter students table
        console.log("Altering students table...");
        await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0;`;
        await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS last_checkin_date DATE;`;
        await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS expo_push_token VARCHAR(255);`;
        console.log("Students table altered.");

        // 2. Create feedbacks table
        console.log("Creating feedbacks table...");
        await sql`
            CREATE TABLE IF NOT EXISTS feedbacks (
                id SERIAL PRIMARY KEY,
                student_id INT REFERENCES students(id) ON DELETE CASCADE,
                meal_type VARCHAR(50) NOT NULL,
                rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                photo_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("Feedbacks table created.");

        // 3. Create checkins table
        console.log("Creating checkins table...");
        await sql`
            CREATE TABLE IF NOT EXISTS checkins (
                id SERIAL PRIMARY KEY,
                student_id INT REFERENCES students(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                meal_type VARCHAR(50) NOT NULL,
                status VARCHAR(50) NOT NULL CHECK (status IN ('confirmed', 'opted_out')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (student_id, date, meal_type)
            );
        `;
        console.log("Checkins table created.");

        console.log("DB Initialization Complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error initializing DB:", error);
        process.exit(1);
    }
}

initializeDB();

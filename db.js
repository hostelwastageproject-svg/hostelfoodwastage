// db.js
import dotenv from "dotenv";
dotenv.config();

import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL missing in .env file");
    process.exit(1);
}

export const sql = neon(process.env.DATABASE_URL);

console.log("✅ Neon DB connected (serverless client)");

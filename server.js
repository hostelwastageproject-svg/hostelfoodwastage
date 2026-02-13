import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// Routes
import studentRoutes from "./routes/studentRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import barcodeRoutes from "./routes/barcodeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route Register
app.use("/api/students", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/barcode", barcodeRoutes);


// Test Route
app.get("/", (req, res) => {
    res.send("API is running 🚀");
});

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
// dashboard
app.use("/api/dashboard", dashboardRoutes);
//scan token 
app.use("/api/scan", scanRoutes);
import express, { urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// All connections here
import { connectDb } from "./lib/db.js";

// All routes here
import fileRoutes from "./routes/file.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration (Apply this before routes)
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions)); // <-- Fix: Apply CORS Middleware Here

// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));

// All routes here
app.use("/api/files", fileRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDb();
});

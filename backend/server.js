import express, { urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// All connections here
import connectDb from "./lib/db.js";

// All routes here
import fileRoutes from "./routes/file.routes.js";
import authRoutes from "./routes/auth.routes.js";
import slotRoutes from "./routes/slot.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// CORS Configuration (Apply this before routes)
// const corsOptions = {
//   origin: "http://localhost:5173",
//   credentials: true,
// };
app.use(cors()); // <-- Fix: Apply CORS Middleware Here

// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// All routes here
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api", slotRoutes);
// app.use("/api/admin", adminRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDb();
});

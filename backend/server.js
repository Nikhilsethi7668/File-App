import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// All connections here
import connectDb from "./lib/db.js";

// All routes here
import fileRoutes from "./routes/file.routes.js";
import eventRoutes from "./routes/event.route.js";
import authRoutes from "./routes/auth.routes.js";
import slotRoutes from "./routes/slot.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8493;
// CORS Configuration (Apply this before routes)
const corsOptions = {
  origin:[ "https://file-app-frontend.amiigo.in","http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions)); // <-- Fix: Apply CORS Middleware Here

// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// All routes here
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/events",eventRoutes); 
app.use("/api", slotRoutes);
app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/admin", adminRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDb();
});

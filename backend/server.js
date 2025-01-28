import express from "express";
import mongoose from "mongoose";
import fileRoutes from "./routes/fileRoutes";
import userRoutes from "./routes/userRoutes";
import slotRoutes from "./routes/slotRoutes";

require("dotenv").config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/files", fileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/slots", slotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

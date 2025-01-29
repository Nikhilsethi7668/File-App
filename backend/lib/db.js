import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${db.connection.host}`);
    // res.status(200).json({ message: "MongoDb connected" });
  } catch (error) {
    // res.status(500).json({ message: "MongoDB connection failed" });
    console.log(`MongoDB connection failed: ${error}`);
    exist(1);
  }
};


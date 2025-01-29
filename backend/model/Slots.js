import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  company: String,
  timeSlot: String,
  status: { type: ["available", "booked"], default: "available" }, // available or booked
});

module.exports = mongoose.model("Slot", slotSchema);

const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  company: String,
  timeSlot: String,
  status: { type: String, default: "available" }, // available or booked
});

module.exports = mongoose.model("Slot", slotSchema);

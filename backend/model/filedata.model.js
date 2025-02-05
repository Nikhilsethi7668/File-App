import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    serialNo: Number,
    firstName: String,
    lastName: String,
    company: String,
    title: String,
    email: String,
    phone: String,
    selectedBy: [String],
    slots: {
      type: Map,
      of: String, // Each key (time slot) stores a string value ("free" or "booked")
      default: {},
    },
  },
  { timestamps: true }
);

export const UserCollection = mongoose.model("UserCollection", UserSchema);

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
    slots: { type: Map, of: String },
  },
  { timestamps: true }
);

export const UserCollection = mongoose.model("UserCollection", UserSchema);

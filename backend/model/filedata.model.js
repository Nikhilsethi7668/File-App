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
      first: { type: String, default: "free" },
      second: { type: String, default: "free" },
      third: { type: String, default: "free" },
      fourth: { type: String, default: "free" },
      fifth: { type: String, default: "free" },
      sixth: { type: String, default: "free" },
      seventh: { type: String, default: "free" },
      eighth: { type: String, default: "free" },
      ninth: { type: String, default: "free" },
      tenth: { type: String, default: "free" },
    },
  },
  { timestamps: true }
);

export const UserCollection = mongoose.model("UserCollection", UserSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  users: [
    {
      serialNo: Number,
      firstName: String,
      lastName: String,
      company: String,
      title: String,
      email: String,
      phone: String,
      selectedBy:[String],
    },
  ],
});

export const UserCollection = mongoose.model("UserCollection", UserSchema);

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
    giftCollected: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "not-available", "removed"],
      default: "pending",
      required:true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    await mongoose.model('Slot').deleteMany({ userId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

export const UserCollection = mongoose.model("UserCollection", UserSchema);
import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCollection",
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
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
export const Slots = mongoose.model("Slot", slotSchema);

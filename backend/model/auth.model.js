import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
<<<<<<< HEAD

    lastLogin: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["citizen", "admin"],
      default: "citizen",
    },

    // isVerified: {
    //   type: Boolean,
    //   default: false,
    // },
	
    // resetPasswordToken: String,
    // resetPasswordExpiresAt: Date,
    // verificationToken: String,
    // verificationTokenExpiresAt: Date,
=======
>>>>>>> fed14840f9f5f95e61e956d260c59e7fc589b4ff
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

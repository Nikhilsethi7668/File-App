import { User } from "../model/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateTokenAndCookie } from "../utils/generateToken.js";
//import { sendVerificationEmail } from "../mailtrap/email.js";
// import { sendWelcomeEmail } from "../mailtrap/email.js";
// import { sendPasswordResetEmail } from "../mailtrap/email.js";
// import { sendResetSuccessEmail } from "../mailtrap/email.js";

export const signup = async (req, res) => {
  console.log(req.body);

  const { userName, email, password, isAdmin } = req.body;
  console.log(userName, email, password, isAdmin);

  try {
    if (!userName || !email || !password) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email",
      });
    }
    const userAlreadyExistsbyUsername = await User.findOne({
      username: userName,
    });

    if (userAlreadyExistsbyUsername) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this username",
      });
    }
    const username = userName;

    console.log("password", password);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin,
      // verificationToken,
      // verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    console.log("user", user);

    await user.save();

    generateTokenAndCookie(res, user._id);

    //await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
        confirmPassword: undefined,
      },
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// export const verifyemail = async (req, res) => {
//   const { code } = req.body;

//   try {
//     const user = await User.findOne({
//       verificationToken: code,
//       verificationTokenExpiresAt: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or experied verification code",
//       });
//     }

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpiresAt = undefined;
//     await user.save();

//     await sendWelcomeEmail(user.email, user.name);

//     res.status(200).json({
//       success: true,
//       message: "Email verified Successfully ",
//       user: {
//         ...user._doc,
//         password: undefined,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: `Failed to verify the  Email Account : ${error}`,
//     });
//   }
// };

export const login = async (req, res) => {
  console.log("login");
  console.log(req.body);
  const { email, password } = req.body.email;
  console.log(email, password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    console.log("user", user);

    generateTokenAndCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({
      success: false,
      message: `Login Failes : ${error}`,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged-Out Successfully",
  });
};

// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User Not Found !!!",
//       });
//     }

//     const resetToken = crypto.randomBytes(20).toString("hex");
//     const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hrs

//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpiresAt = resetTokenExpiresAt;
//     await user.save();

//     await sendPasswordResetEmail(
//       user.email,
//       `${process.env.CLIENT_URL}/reset-password/${resetToken}`
//     );

//     res.status(200).json({
//       success: true,
//       message: "Password Reset Link Send ton your email",
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: `error in sending email : ${error}`,
//     });
//   }
// };

// export const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpiresAt: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired token",
//       });
//     }

//     // update password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpiresAt = undefined;
//     user.save();

//     await sendResetSuccessEmail(user.email);

//     res.status(200).json({
//       success: true,
//       message: "Reset Successful Email send Successfully!!!",
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
export const checkAuth = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  console.log("token", token);
  const decoded = jwt.verify(token, process.env.JWT_Token);
  const user = await User.findById(decoded.userId);
  if (!user) {
    return res.status(401).json({ authenticated: false });
  }
  return res.status(200).json({ authenticated: true, user });
};

import jwt from "jsonwebtoken";

export const generateTokenAndCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_Token||"SECRET_KEY_FILE_APP", {
    expiresIn: "7d",
  });
  console.log("Token:", token);
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

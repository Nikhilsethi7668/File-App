const Admin = require("../model/Admin.model");

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email, password });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.status(200).json({ message: "Admin logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

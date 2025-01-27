const XLSX = require("xlsx");
const User = require("../models/User");

exports.uploadFile = async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Save users in database
    await User.insertMany(jsonData);
    res.status(200).json({ message: "File uploaded and data saved" });
  } catch (error) {
    res.status(500).json({ error: "Error processing file" });
  }
};

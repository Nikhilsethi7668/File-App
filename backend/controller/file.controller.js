import xlsx from "xlsx";
import { UserCollection } from "../model/filedata.model.js"; // Adjust the path as necessary
// Adjust the path as necessary

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // Read the file buffer directly from the request
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Map the data to an array of users
    const users = data.map((row) => ({
      serialNo: row["Sr. No"],
      firstName: row["First Name"],
      lastName: row["Last Name"],
      company: row["Company Name"],
      title: row["Title"],
      email: row["Email Address"],
      phone: row["Mobile Phone Number"],
    }));

    // Save the users as a single document in the database
    const userDocument = new UserCollection({ users });
    await userDocument.save();

    res.status(200).json({ message: "File uploaded and data saved successfully." });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





export const getFileData = async (req, res) => {
  try {
    // Fetch all data from the database
    const data = await User.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
import xlsx from "xlsx";
import { UserCollection } from "../model/filedata.model.js";







export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { raw: false });

    const users = data.map((row) => {
      const selectedBy = [];
      const columnMapping = {
        outsystems: "1:1 meeting Outsystems (5)",
        vmware: "1:1 meeting Vmware (5)",
        rackspace: "1:1 meetings rackspace/google",
        awswl: "AWS WL",
      };

      Object.entries(columnMapping).forEach(([key, columnName]) => {
        if (["1", "1PTR", "1CORP"].includes(row[columnName]?.trim())) {
          selectedBy.push(columnName);
        }
      });

      return {
        serialNo: row["Sr. No"] || "N/A",
        firstName: row["First Name"] || "N/A",
        lastName: row["Last Name"] || "N/A",
        company: row["Company Name"] || "N/A",
        title: row["Title"] || "N/A",
        email: row["Email Address"] || "N/A",
        phone: row["Mobile Phone Number"] || "N/A",
        selectedBy,
      };
    });

    // Upsert (Update or Insert) instead of deleting all data
    await UserCollection.updateOne({}, { $set: { users } }, { upsert: true });

    return res.status(200).json({
      message: "File uploaded and data saved successfully",
      usersProcessed: users.length,
    });
  } catch (error) {
    console.error("Error in upload process:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

export const getFileData = async (req, res) => {
  try {
    const data = await UserCollection.findOne({}, { users: 1, _id: 0 });
    return res.status(200).json({ users: data?.users || [] });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};






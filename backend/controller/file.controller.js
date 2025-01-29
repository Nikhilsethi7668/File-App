import xlsx from "xlsx";
import { UserCollection } from "../model/filedata.model.js";



export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Read the Excel file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { raw: false });

    if (!data.length) {
      return res.status(400).json({ error: "Uploaded file is empty" });
    }

    // Dynamically detect column names
    const headers = Object.keys(data[0]);
    console.log("Detected Headers:", headers);

    // Column mappings (ensure keys match the exact Excel column names)
    const columnMapping = {
      serialNo: "Sr. No",
      firstName: "First Name",
      lastName: "Last Name",
      company: "Company Name",
      title: "Title",
      email: "Email Address",
      phone: "Mobile Phone Number",
      outsystems: "1:1 meeting Outsystems (5)",
      vmware: "1:1 meeting Vmware (5)",
      rackspace: "1:1 meetings rackspace/google",
      awswl: "AWS WL",
    };

    // Ensure required columns exist in the uploaded file
    const missingColumns = Object.values(columnMapping).filter(col => !headers.includes(col));
    if (missingColumns.length) {
      return res.status(400).json({ error: `Missing columns: ${missingColumns.join(", ")}` });
    }

    // Process the data
    const users = data.map((row) => {
      const selectedBy = [];

      // Check for values in "1", "1PTR", or "1CORP"
      ["outsystems", "vmware", "rackspace", "awswl"].forEach((key) => {
        const columnName = columnMapping[key];
        if (["1", "1PTR", "1CORP"].includes(row[columnName]?.trim())) {
          selectedBy.push(columnName);
        }
      });

      return {
        serialNo: row[columnMapping.serialNo],
        firstName: row[columnMapping.firstName],
        lastName: row[columnMapping.lastName],
        company: row[columnMapping.company],
        title: row[columnMapping.title],
        email: row[columnMapping.email],
        phone: row[columnMapping.phone],
        selectedBy,
      };
    });

    // Clear existing data and insert new data
    await UserCollection.deleteMany({});
    const userDocument = new UserCollection({ users });
    await userDocument.save();

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

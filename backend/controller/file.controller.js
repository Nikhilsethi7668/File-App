import xlsx from "xlsx";
import { UserCollection } from "../model/filedata.model.js";

<<<<<<< HEAD






=======
>>>>>>> 7d654731f9a0f937c9741af19fb6aa29d69071ca
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

    // Get the first sheet (index 0)
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

<<<<<<< HEAD
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
=======
    // Convert sheet to JSON (first row as headers)
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false });

    if (data.length < 2) {
      return res
        .status(400)
        .json({ error: "No valid data rows found in the file." });
    }

    // Extract headers from the first row
    const headers = data[0].map((h) => h.trim().toLowerCase()); // Normalize headers
    console.log("Detected headers:", headers);

    // Remove header row
    data.shift();

    // Define schema mapping
    const fieldMappings = {
      "sr no": "serialNo",
      "first name": "firstName",
      "last name": "lastName",
      company: "company",
      title: "title",
      email: "email",
      phone: "phone",
    };

    const selectionValues = ["1", "1 PTR", "1 CORP", "1 STR", "1 CORP"]; // Values indicating selection

    // Identify column indexes based on mapping
    const fieldIndexes = {};
    headers.forEach((header, index) => {
      if (fieldMappings[header]) {
        fieldIndexes[fieldMappings[header]] = index;
      }
    });

    // Identify company selection columns (everything apart from main schema fields)
    const companyColumns = headers.filter(
      (col) => !Object.keys(fieldMappings).includes(col)
    );

    // Process each row dynamically
    const processedData = data
      .map((row) => {
        let rowData = {};

        // Extract required fields and map them
        Object.keys(fieldIndexes).forEach((field) => {
          const index = fieldIndexes[field];
          if (index !== undefined) {
            const value = row[index]?.toString().trim();
            if (value) {
              rowData[field] = value;
            }
          }
        });

        // Extract selected companies
        let selectedBy = [];
        companyColumns.forEach((company) => {
          const index = headers.indexOf(company);
          if (index !== -1) {
            const value = row[index]?.toString().trim().toUpperCase();
            if (selectionValues.includes(value)) {
              selectedBy.push(company);
            }
          }
        });

        // Add selectedBy array if not empty
        if (selectedBy.length > 0) {
          rowData.selectedBy = selectedBy;
        }

        return Object.keys(rowData).length > 0 ? rowData : null; // Ignore empty rows
      })
      .filter(Boolean); // Remove null rows

    console.log("Processed Data:", processedData);

    // **SAVE TO DATABASE**
    if (processedData.length > 0) {
      await UserCollection.insertMany(processedData); // Save data to MongoDB
    } else {
      return res.status(400).json({ error: "No valid data to insert" });
    }
>>>>>>> 7d654731f9a0f937c9741af19fb6aa29d69071ca

    return res.status(200).json({
      message: "File processed and data saved successfully",
      data: processedData,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

export const getFileData = async (req, res) => {
  try {
    const data = await UserCollection.find({});
    return res.status(200).json({ users: data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};






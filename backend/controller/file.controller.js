import xlsx from "xlsx";
import { UserCollection } from "../model/filedata.model.js";
import { Slots } from "../model/Slots.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON (first row as headers)
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false });

    if (data.length < 2) {
      return res
        .status(400)
        .json({ error: "No valid data rows found in the file." });
    }

    // Extract headers from the first row
    const headers = data[0].map((h) => h.trim().toLowerCase());
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

    const selectionValues = new Set(["1ptr", "1corp", "1str"]);

    // Identify column indexes based on mapping
    const fieldIndexes = {};
    headers.forEach((header, index) => {
      if (fieldMappings[header]) {
        fieldIndexes[fieldMappings[header]] = index;
      }
    });

    // Identify company selection columns (non-schema columns)
    const companyColumns = headers.filter(
      (col) => !Object.keys(fieldMappings).includes(col)
    );

    // Process each row dynamically
    const processedData = data
      .map((row) => {
        const rowData = {};

        // Extract mapped fields
        Object.entries(fieldIndexes).forEach(([field, index]) => {
          const value = row[index]?.toString().trim();
          if (value) rowData[field] = value;
        });

        // Check company selections
        const selectedBy = [];
        companyColumns.forEach((company) => {
          const index = headers.indexOf(company);
          if (index === -1) return;

          const value = row[index]?.toString().trim().toLowerCase();
          if (selectionValues.has(value)) {
            selectedBy.push(company);
          }
        });

        if (selectedBy.length > 0) {
          rowData.selectedBy = selectedBy;
        }

        return Object.keys(rowData).length > 0 ? rowData : null;
      })
      .filter(Boolean);

    console.log("Processed Data:", processedData);

    // Upsert data into database
    // Replace the updateOne/upsert block with:
    if (processedData.length > 0) {
      // Clear existing data and insert fresh data
      await UserCollection.deleteMany({}); // Remove all existing documents
      await Slots.deleteMany({});
      await UserCollection.insertMany(processedData); // Insert new documents
    } else {
      return res.status(400).json({ error: "No valid data to insert" });
    }

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
// import { UserCollection } from "../model/filedata.model.js";

// export const deleteSlot = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     console.log("user id is", userId);
//     const { slotTime } = req.body;
//     console.log(slotTime);

//     if (!userId || !slotTime) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const user = await UserCollection.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     console.log(user.slots);
//     console.log(user.slots.get(slotTime));

//     if (user.slots && user.slots.get(slotTime)) {
//       user.slots.delete(slotTime); // Use the delete method to remove the slot
//       await user.save();
//       return res.status(200).json({ message: "Slot deleted successfully" });
//     } else {
//       return res.status(404).json({ error: "Slot not found" });
//     }
//   } catch (error) {
//     console.error("Error deleting slot:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const getCompanyData = async (req, res) => {
//   try {
//     const companyName = req.params.companyName.toLowerCase();
//     // companyName.toLowerCase();
//     console.log("Searching for company:", companyName);

//     // Fetch all users who have the 'slots' field (ignore those without slots)
//     const users = await UserCollection.find({ slots: { $exists: true } });

//     // Filter users whose slots map contains the companyName
//     const filteredUsers = users.filter((user) =>
//       Array.from(user.slots.values()).includes(companyName)
//     );

//     console.log("Found users:", filteredUsers);

//     // Return the filtered users as a response
//     res.json(filteredUsers);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Error fetching users" });
//   }
// };

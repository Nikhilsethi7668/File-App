import { Slots } from "../model/Slots.js";
import { UserCollection } from "../model/filedata.model.js";

export const deleteSlot = async (req, res) => {
  try {
    const userId = req.params.id;
    const { slotTime } = req.body;

    if (!userId || !slotTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find and delete the slot
    const deletedSlot = await Slots.findOneAndDelete({
      userId: userId,
      timeSlot: slotTime,
    });

    if (!deletedSlot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    console.error("Error deleting slot:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getCompanyData = async (req, res) => {
  try {
    const companyName = req.params.company.toLowerCase();

    // Find slots for the company and populate specific user fields from UserCollection schema
    const slots = await Slots.find({ company: companyName }).populate(
      "userId",
      "serialNo firstName lastName company title email phone selectedBy"
    );

    // Extract unique users with their details

    return res.status(200).json(slots);
  } catch (error) {
    console.error("Error fetching company data:", error);
    return res.status(500).json({ message: "Error fetching company data" });
  }
};

export const bookSlot = async (req, res) => {
  try {
    const { userId, company, timeSlot } = req.body;
    const existingTimeSlot = await Slots.findOne({ timeSlot, userId });
    if (existingTimeSlot) {
      return res
        .status(400)
        .json({ error: "Slot already booked please choose another slot" });
    }
    const existingSlot = await Slots.findOne({ userId, company });

    if (existingSlot) {
      return res
        .status(400)
        .json({ error: "Slot with same company already booked" });
    }

    const newSlot = new Slots({ userId, company, timeSlot });
    await newSlot.save();

    res.status(201).json({ message: "Slot booked successfully" });
  } catch (error) {
    console.error("Error booking slot:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllBookedSlots = async (req, res) => {
  try {
    const slots = await Slots.find();
    res.json(slots);
  } catch (error) {
    console.error("Error fetching all booked slots:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const getCompanyData = async (req, res) => {
//   try {
//     const companyName = req.params.companyName.toLowerCase();

//     // Find slots for the company and populate user data
//     const slots = await Slots.find({ company: companyName }).populate("userId");
//     const users = slots
//       .map((slot) => slot.userId)
//       .filter((user) => user !== null);

//     res.json(users);
//   } catch (error) {
//     console.error("Error fetching company data:", error);
//     res.status(500).json({ message: "Error fetching company data" });
//   }
// };

export const toggleCompletion = async (req, res) => {
  try {
    const slotId = req.params.id;
    const { completed } = req.body; // Expecting { completed: true/false }

    const updatedSlot = await Slots.findByIdAndUpdate(
      slotId,
      { completed },
      { new: true }
    );
    console.log(updatedSlot);

    return res.status(200).json(updatedSlot);
  } catch (error) {
    console.error("Error updating slot status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

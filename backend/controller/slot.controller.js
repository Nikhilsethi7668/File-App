import { Slots } from "../model/Slots.js";

export const deleteSlot = async (req, res) => {
  try {
    const userId = req.params.id;
    const { slotTime,event } = req.body;

    if (!userId || !slotTime||!event) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find and delete the slot
    const deletedSlot = await Slots.findOneAndDelete({
      userId: userId,
      timeSlot: slotTime,
      event
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
    const { event } = req.body;
    if (!event) {
      return res.status(400).json({ error: "Event id is required" });
    }

    // Find slots for the company and populate specific user fields from UserCollection schema
    const slots = await Slots.find({ company: companyName,event }).populate(
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
    const { userId, company,event, timeSlot } = req.body;

    if (!userId || !timeSlot||!event||!company) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const existingTimeSlot = await Slots.findOne({event, timeSlot, userId });
    if (existingTimeSlot) {
      return res
        .status(400)
        .json({ error: "Slot already booked please choose another slot" });
    }
    const existingSlot = await Slots.findOne({event, userId, company });

    if (existingSlot) {
      return res
        .status(400)
        .json({ error: "Slot with same company already booked" });
    }

    const newSlot = new Slots({ userId, company, timeSlot,event });
    await newSlot.save();

    res.status(201).json({ message: "Slot booked successfully" });
  } catch (error) {
    console.error("Error booking slot:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllBookedSlots = async (req, res) => {
  try {
    const { event } = req.body;

    if (!event) {
      return res.status(400).json({ error: "Event id is required" });
    }
    const slots = await Slots.find({event});
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
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: "Completed status must be a boolean" });
    }

    const updatedSlot = await Slots.findByIdAndUpdate(
      slotId,
      { $set: { completed } },  // Explicit $set operator
      { new: true, runValidators: true }  // Return updated doc and run validators
    );

    if (!updatedSlot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    return res.status(200).json({
      message: "Slot updated successfully",
      slot: updatedSlot
    });
    
  } catch (error) {
    console.error("Error updating slot status:", error);
    return res.status(500).json({ 
      error: "Internal Server Error",
      details: error.message 
    });
  }
};
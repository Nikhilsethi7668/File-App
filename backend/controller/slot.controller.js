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
    const companyName = req.params.companyName.toLowerCase();

    // Find slots for the company and populate user data
    const slots = await Slots.find({ company: companyName }).populate("userId");
    const users = slots
      .map((slot) => slot.userId)
      .filter((user) => user !== null);

    res.json(users);
  } catch (error) {
    console.error("Error fetching company data:", error);
    res.status(500).json({ message: "Error fetching company data" });
  }
};

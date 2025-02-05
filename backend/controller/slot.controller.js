import { UserCollection } from "../model/filedata.model.js";

export const bookSlots = async (req, res) => {
  try {
    const userId = req.params.id;
    const { slotTime } = req.body;

    // Check if userId and slotTime are provided
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }
    if (!slotTime) {
      return res.status(400).json({ error: "Slot time is missing" });
    }

    // Find user by ID
    const user = await UserCollection.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the slot time to "booked"
    if (user.slots[slotTime] === "free") {
      user.slots[slotTime] = data.company;

      // Save the updated user document
      await user.save();

      return res
        .status(200)
        .json({ message: "Slot booked successfully", user });
    } else {
      return res.status(400).json({ error: "Slot already booked" });
    }
  } catch (error) {
    console.error("Error booking slot:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

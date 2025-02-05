import { UserCollection } from "../model/filedata.model.js";

export const bookSlots = async (req, res) => {
  try {
    const userId = req.params.id;
    const { slotTime, company } = req.body;

    console.log("Received data:", { userId, slotTime, company });

    if (!userId || !slotTime || !company) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await UserCollection.findById(userId);
    console.log("Found user:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure slots field exists in the user document
    if (!user.slots) {
      user.slots = new Map(); // Initialize if it doesn't exist
    }

    // Check if the slot is already booked
    if (user.slots.has(slotTime)) {
      return res.status(400).json({ error: "Slot already booked" });
    }

    // If slot is available, book it
    user.slots.set(slotTime, company);

    // Save the updated user document
    await user.save();
    console.log(
      "Updated user after booking:",
      await UserCollection.findById(userId)
    );

    return res.status(200).json({ message: "Slot booked successfully", user });
  } catch (error) {
    console.error("Error booking slot:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

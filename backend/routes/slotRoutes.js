router.post("/book", async (req, res) => {
  const { userId, timeSlot } = req.body;

  // Mark the slot as booked
  await Slot.updateOne({ userId, timeSlot }, { status: "booked" });
  res.json({ message: "Slot booked successfully" });
});

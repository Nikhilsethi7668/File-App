import mongoose from "mongoose";
import { Events } from "../model/event.model.js";
import { User } from "../model/auth.model.js";

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, image, description, assignedTo,slotGap, createdBy,startDate,endDate } = req.body;
    
    // Validate required fields
    if (!title || !assignedTo || !createdBy) {
      return res.status(400).json({ error: "Title, assignedTo, and createdBy are required" });
    }

    const newEvent = new Events({
      title,
      image,
      description,
      assignedTo,
      createdBy,
      slotGap,
      startDate,
      endDate
    });

    const savedEvent = await newEvent.save();
    return res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    // First fetch the user using req.userId
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let query = {};
    
    // If user is not admin, only show events assigned to them
    if (user.role !== 'admin') {
      query = { assignedTo: req.userId };
    }

    const events = await Events.find(query)
      .populate('assignedTo', 'username email role')
      .populate('createdBy', 'username email');

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    const event = await Events.findById(id)
      .populate({
        path: 'assignedTo',
        select: 'username email',  // Only include these fields
        options: { sort: { username: 1 } }  // Optional: sort assigned users
      })
      .populate('createdBy', 'username email');

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// Delete an event by ID
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    const deletedEvent = await Events.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Events.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    return res.status(200).json(updatedEvent);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const getEventTitleList = async (req, res) => {
  try {
    // Get all events with just title and _id fields
    const events = await Events.find({}, { title: 1 }).sort({ title: 1 });

    // Transform the data to a simpler format if needed
    const eventList = events.map(event => ({
      id: event._id,
      title: event.title
    }));

    return res.status(200).json({
      success: true,
      data: eventList
    });
  } catch (error) {
    console.error("Error fetching event titles:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message
    });
  }
};
import mongoose from "mongoose";
import { Events } from "../model/event.model.js";

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, image, description, assignedTo, createdBy,startDate,endDate } = req.body;
    
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
    const events = await Events.find({})
      .populate('assignedTo', 'username email') // Example fields to populate
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
      .populate('assignedTo', 'username email')
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
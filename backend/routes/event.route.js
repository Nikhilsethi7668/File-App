import express from 'express';
import { createEvent, deleteEvent, getAllEvents, getEventById } from '../controller/event.controller.js';


const router = express.Router();

// Create a new event
router.post('/', createEvent);

// Get all events
router.get('/', getAllEvents);

// Get a single event by ID
router.get('/:id', getEventById);

// Delete an event by ID
router.delete('/:id', deleteEvent);

export default router;
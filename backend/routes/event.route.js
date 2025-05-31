import express from 'express';
import { createEvent, deleteEvent, getAllEvents, getEventById, getEventTitleList, updateEvent, uploadEventImage } from '../controller/event.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

// Create a new event
router.post('/',uploadEventImage, createEvent);

// Get all events
router.get('/',protectRoute, getAllEvents);

// Get a single event by ID
router.get('/:id', getEventById);
router.get('/event-list', getEventTitleList);

// Delete an event by ID
router.delete('/:id', deleteEvent);

router.put('/:id', updateEvent);

export default router;
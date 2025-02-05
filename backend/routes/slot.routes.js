import express from "express";
import { bookSlots } from "../controller/slot.controller.js";
import { deleteSlot } from "../controller/file.controller.js";
const router = express.Router();

router.post(`/booking-slot/:id`, bookSlots);
router.delete(`/files/delete-slot/:id`, deleteSlot);

export default router;

import express from "express";
import { bookSlots } from "../controller/slot.controller.js";
const router = express.Router();

router.post(`/booking-slot/:id`, bookSlots);

export default router;

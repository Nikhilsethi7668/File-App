import express from "express";
import { bookSlots } from "../controller/slot.controller";
const router = express.Router();

router.post(`/booking-slot/:id`, bookSlots);

export default router;

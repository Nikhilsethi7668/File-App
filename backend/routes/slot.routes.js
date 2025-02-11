import express from "express";

import {
  bookSlot,
  deleteSlot,
  getAllBookedSlots,
  getCompanyData,
  //   markAsCompleted,
  toggleCompletion,
} from "../controller/slot.controller.js";
const router = express.Router();

router.post(`/booking-slot`, bookSlot);
router.delete(`/slot/delete/:id`, deleteSlot);
router.get(`/slot/get-all-booked-slots`, getAllBookedSlots);
router.get(`/slot/company/:company`, getCompanyData);
router.post(`/slot/toggle-completed/:id`, toggleCompletion);
export default router;

import express from "express";
import {  login, logout, signup } from "../controller/auth.controller.js";

const router = express.Router();



router.post("/signup", signup);

router.post("/login",login);

router.post("/logout",logout);

// router.post("/verify-email",verifyemail);

// router.post("/forgot-password",forgotPassword);

// router.post("/reset-password/:token", resetPassword);

export default router;
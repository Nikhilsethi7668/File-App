import express from "express";
import User from "../models/User";

router.get("/", async (req, res) => {
    const query = req.query.search || "";
    const users = await User.find({ firstName: new RegExp(query, "i") });
    res.json(users);
});

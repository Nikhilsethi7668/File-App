import express from "express";
import { uploadFile, getFileData } from "../controller/file.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

// Upload file route
router.post("/upload-file", upload.single("file"), uploadFile);

// Get file data route
router.get("/get-filedata", getFileData);


export default router;

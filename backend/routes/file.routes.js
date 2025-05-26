import express from "express";
import {
  uploadFile,
  getFileData,
  deleteAllUsers,
  // getCompanyData,
} from "../controller/file.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

// Upload file route
router.post("/upload-file/:event", upload.single("file"), uploadFile);

// Get file data route
router.get("/get-filedata/:event", getFileData);
router.delete("/delete-filedata/:event", deleteAllUsers);
// router.get(`/company/:companyName`, getCompanyData);`

export default router;

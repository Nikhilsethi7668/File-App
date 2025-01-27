const express = require("express");
const { uploadFile, parseFile } = require("../controllers/fileController");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/insights", async (req, res) => {
  const totalUsers = await User.countDocuments();
  const companyWiseSelections = await User.aggregate([
    { $group: { _id: "$company", count: { $sum: 1 } } },
  ]);
  res.json({ totalUsers, companyWiseSelections });
});

router.post("/upload", uploadMiddleware.single("file"), uploadFile);
router.get("/parse/:id", parseFile);

module.exports = router;

const express = require("express");
const UploadController = require("../controllers/uploadController");
const router = express.Router();

router.post("/", UploadController.upload);
router.get("/tes", (req, res) => {
  res.send("tes");
});

module.exports = router;

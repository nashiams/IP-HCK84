const express = require("express");
const UploadController = require("../controllers/uploadController");
const router = express.Router();

router.post("/", UploadController.upload);

module.exports = router;

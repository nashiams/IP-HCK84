const express = require("express");
const RequirementsController = require("../controllers/requirementsController");
const router = express.Router();

router.post("/", RequirementsController.requirements);

module.exports = router;

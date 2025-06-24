const express = require("express");
const RequirementsController = require("../controllers/requirementsController");
const router = express.Router();

router.post("/", RequirementsController.submitRequirements);
router.get("/tes", (req, res) => {
  res.send("tes");
});

module.exports = router;

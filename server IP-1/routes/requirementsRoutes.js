const express = require("express");

const CodeCheckController = require("../controllers/codecheckController");
const router = express.Router();

// router.post("/", RequirementsController.submitRequirements);
router.post("/", CodeCheckController.submitRequirements);
router.get("/tes", (req, res) => {
  res.send("tes");
});

module.exports = router;

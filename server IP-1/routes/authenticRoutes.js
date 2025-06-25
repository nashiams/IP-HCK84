const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.post("/", UserController.register);
router.post("/login", UserController.login);
router.get("/tes", (req, res) => {
  res.send("tes");
});

module.exports = router;

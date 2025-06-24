const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();

// POST /api/auth/register - Register user (email, password, name)
router.post("/register", UserController.register);

// POST /api/auth/login - Login → returns JWT token
router.post("/login", UserController.login);

// GET /api/auth/google - Token-Based Login Modern SPA Way
router.get("/google", (req, res) => {
  // Controller logic will be implemented later
  res
    .status(501)
    .json({ message: "Google auth endpoint - Controller not implemented yet" });
});

module.exports = router;

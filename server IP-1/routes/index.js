const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const requirementsRoutes = require("./requirementsRoutes");
const uploadRoutes = require("./uploadRoutes");
// const analyzeRoutes = require("./analyzeRoutes");

router.use("/api/auth", authRoutes);

// Protected routes (require Bearer token)
router.use("/api/requirements", requirementsRoutes);
router.use("/api/upload", uploadRoutes);
// router.use("/api/analyze", analyzeRoutes);
module.exports = router;

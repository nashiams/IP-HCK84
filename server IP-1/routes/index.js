const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const requirementsRoutes = require("./requirementsRoutes");
const uploadRoutes = require("./uploadRoutes");
// const analyzeRoutes = require("./routes/analyzeRoutes");

router.use("/api/auth", authRoutes);
router.get("/", (req, res) => {
  res.send("tes");
});
// Protected routes (require Bearer token)
router.use("/api/requirements", requirementsRoutes);
router.use("/api/upload", uploadRoutes);
// app.use("/api/analyze", authenticate, analyzeRoutes);
module.exports = router;

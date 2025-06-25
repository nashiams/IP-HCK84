const express = require("express");
const TodoistController = require("../controllers/todoistController");

const router = express.Router();

router.get("/list", TodoistController.getTasks);
router.post("/create", TodoistController.createTask);
router.post("/update", TodoistController.updateTask);
router.delete("/delete", TodoistController.deleteTask);

router.get("/tes", (req, res) => {
  res.send("tes");
});

module.exports = router;

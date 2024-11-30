const express = require("express");
const router = express.Router();
const History = require("./historyModel");

// Get all history
router.get("/", async (req, res) => {
  try {
    const history = await History.find().sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Add a new calculation to history
router.post("/", async (req, res) => {
  const { source, expression, result } = req.body;
  if (!source || !expression || !result) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newEntry = new History({ source, expression, result });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: "Failed to save history" });
  }
});

// Delete all history
router.delete("/", async (req, res) => {
  try {
    await History.deleteMany({});
    res.json({ message: "All history cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear history" });
  }
});

// Delete a single calculation by _id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await History.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ error: "Calculation not found" });
    }

    res.json({ message: "Calculation deleted successfully", id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete calculation" });
  }
});

module.exports = router;

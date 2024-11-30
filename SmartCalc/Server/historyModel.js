const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  source: { type: String, required: true }, // e.g., "DrawToCalculate", "Voice", etc.
  expression: { type: String, required: true },
  result: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", historySchema);

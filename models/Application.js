const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  cvUrl: String,
  score: Number,
  extractedText: String,
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);

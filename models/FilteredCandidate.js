const mongoose = require("mongoose");

const filteredCandidateSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  manuallySelected: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("FilteredCandidate", filteredCandidateSchema);

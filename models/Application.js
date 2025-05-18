const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  cvUrl: String,
  score: Number,
  extractedText: String,
  
  // New fields added
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);

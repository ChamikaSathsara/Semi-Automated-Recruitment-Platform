const Job = require("../models/Job");
const Application = require("../models/Application");
const FilteredCandidate = require("../models/FilteredCandidate");
const { exportFilteredCSV, exportFilteredJSON } = require("../services/exportService");

// POST /jobs
exports.createJob = async (req, res) => {
  const { title, description } = req.body;
  const job = new Job({ title, description });
  await job.save();
  res.status(201).json(job);
};

// PATCH /jobs/:id/limit
exports.setJobLimit = async (req, res) => {
  const { id } = req.params;
  const { maxApplications } = req.body;
  const job = await Job.findByIdAndUpdate(id, { maxApplications }, { new: true });
  res.json(job);
};

// POST /jobs/:id/keywords
exports.addKeywords = async (req, res) => {
  const { id } = req.params;
  const { keywords } = req.body;
  const job = await Job.findById(id);
  job.keywords = keywords;
  await job.save();
  res.json(job);
};

// GET /applications/:jobId
exports.listApplications = async (req, res) => {
  const { jobId } = req.params;
  const apps = await Application.find({ job: jobId }).populate("candidate").sort({ score: -1 });
  res.json(apps);
};

// POST /filtered/:appId
exports.pushToFiltered = async (req, res) => {
  const { appId } = req.params;
  const exists = await FilteredCandidate.findOne({ application: appId });
  if (exists) return res.status(400).json({ message: "Already added" });

  const filtered = new FilteredCandidate({ application: appId });
  await filtered.save();
  res.status(201).json(filtered);
};

// GET /filtered/export
exports.exportFiltered = async (req, res) => {
  const type = req.query.type || "json";
  if (type === "csv") {
    const csv = await exportFilteredCSV();
    res.header("Content-Type", "text/csv");
    res.attachment("filtered.csv").send(csv);
  } else {
    const json = await exportFilteredJSON();
    res.json(JSON.parse(json));
  }
};

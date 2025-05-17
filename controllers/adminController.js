const Job = require("../models/Job");
const Application = require("../models/Application");
const FilteredCandidate = require("../models/FilteredCandidate");
const { exportFilteredCSV, exportFilteredJSON } = require("../services/exportService");

// POST /jobs - Create a new job
exports.createJob = async (req, res) => {
  const { title, description } = req.body;
  const job = new Job({ title, description });
  await job.save();
  res.status(201).json(job);
};

// PATCH /jobs/:id/limit - Set max applications for a job
exports.setJobLimit = async (req, res) => {
  const { id } = req.params;
  const { maxApplications } = req.body;
  const job = await Job.findByIdAndUpdate(id, { maxApplications }, { new: true });
  res.json(job);
};

// POST /jobs/:id/keywords - Add keywords to a job
exports.addKeywords = async (req, res) => {
  const { id } = req.params;
  const { keywords } = req.body;
  const job = await Job.findById(id);
  job.keywords = keywords;
  await job.save();
  res.json(job);
};

// GET /applications/:jobId - List all applications for a job, sorted by score
exports.listApplications = async (req, res) => {
  const { jobId } = req.params;
  const apps = await Application.find({ job: jobId })
    .populate("candidate")
    .sort({ score: -1 }); // Sort applications by score in descending order
  res.json(apps);
};

// POST /filtered/:appId - Add an application to the filtered list
exports.pushToFiltered = async (req, res) => {
  const { appId } = req.params;
  const exists = await FilteredCandidate.findOne({ application: appId });
  if (exists) return res.status(400).json({ message: "Already added to filtered list" });

  const filtered = new FilteredCandidate({ application: appId });
  await filtered.save();
  res.status(201).json(filtered);
};

// GET /filtered/export - Export the filtered list as JSON or CSV
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

// New function to view all jobs
exports.viewAllJobs = async (req, res) => {
  try {
    console.log('----------------->')
    const jobs = await Job.find();
    console.log(jobs)
    res.json(jobs);
  } catch (error) {
    console.log('------------->')
    res.status(500).json({ message: "Error retrieving jobs", error });
  }
};

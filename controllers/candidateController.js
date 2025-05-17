const Job = require("../models/Job");
const Application = require("../models/Application");
const { uploadToS3, extractTextFromS3PDF } = require("../services/awsService");
const { scoreCV } = require("../services/scoringService");
const multer = require("multer");
const upload = multer();

// GET /jobs
exports.listJobs = async (req, res) => {
  const jobs = await Job.find({ isActive: true });
  res.json(jobs);
};

// POST /apply/:jobId
exports.applyToJob = [
  upload.single("cv"),
  async (req, res) => {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) return res.status(404).json({ message: "Job not found" });

    const appliedCount = await Application.countDocuments({ job: jobId });
    if (appliedCount >= job.maxApplications) {
      job.isActive = false;
      await job.save();
      return res.status(403).json({ message: "Application limit reached" });
    }

    const fileBuffer = req.file.buffer;
    const fileName = `cv_${Date.now()}.pdf`;
    const cvUrl = await uploadToS3(fileBuffer, fileName, req.file.mimetype);

    const extractedText = await extractTextFromS3PDF(fileName);
    const score = scoreCV(extractedText, job.keywords || []);

    const app = new Application({
      candidate: req.user._id,
      job: jobId,
      cvUrl,
      score,
      extractedText,
    });

    await app.save();
    res.status(201).json(app);
  }
];

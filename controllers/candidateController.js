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
// POST /apply/:jobId
exports.applyToJob = [
  upload.single("cv"),  // This handles single file upload (cv)
  async (req, res) => {

    const { jobId } = req.params;
    const { name, email, phoneNumber } = req.body;

    // Check if required fields are present
    if (!name || !email || !phoneNumber) {
      return res.status(400).json({
        message: "Name, email, and phone number are required"
      });
    }

    // Find the job by jobId
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({
        message: "Job not found or job is no longer active"
      });
    }

    // Check if the application limit has been reached
    const appliedCount = await Application.countDocuments({ job: jobId });
    if (appliedCount >= job.maxApplications) {
      job.isActive = false;  // Deactivate the job if the application limit is reached
      await job.save();
      return res.status(403).json({
        message: "Application limit reached. Job is now closed."
      });
    }

    // Process the CV file (currently commented out for testing purposes)
    const fileBuffer = req.file.buffer;  // Accessing the file buffer
    const fileName = `cv_${Date.now()}.pdf`;  // Generating a unique file name based on timestamp

    let cvUrl = '';  // Placeholder, update with actual logic for S3 upload
    cvUrl = await uploadToS3(fileBuffer, fileName, req.file.mimetype);  // Upload to S3

    let extractedText = '';  // Placeholder, update with actual logic for text extraction
    extractedText = await extractTextFromS3PDF(cvUrl);  // Extract text from the CV PDF

    let score = 0;  // Placeholder score, update with actual CV scoring logic
    score = scoreCV(extractedText, job.keywords || []);  // Score the CV based on job keywords

    // Create a new application document
    const app = new Application({
      job: jobId,
      cvUrl,  // URL of the CV on S3
      score,  // CV score based on the content
      extractedText,  // Extracted text from the CV
      name,
      email,
      phoneNumber,
    });

    await app.save();  // Save the application to the database

    // Respond with the created application data
    res.status(200).json({
      message: "Job application created successfully",
      application: {
        id: app._id,
        job: app.job,
        name: app.name,
        email: app.email,
        phoneNumber: app.phoneNumber,
        cvUrl: app.cvUrl,
        score: app.score,
        extractedText: app.extractedText,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt
      }
    });
  }
];

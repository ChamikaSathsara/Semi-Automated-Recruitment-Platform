const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const {
  createJob,
  setJobLimit,
  addKeywords,
  listApplications,
  pushToFiltered,
  exportFiltered,
  viewAllJobs, // Added this new viewAllJobs function
} = require("../controllers/adminController");


// Admin routes
router.post("/jobs", createJob);
router.patch("/jobs/:id/limit", setJobLimit);
router.post("/jobs/:id/keywords", addKeywords);
router.get("/applications/:jobId", listApplications);
router.post("/filtered/:appId", pushToFiltered);
router.get("/filtered/export", exportFiltered);

// New route for viewing all jobs
router.get("/jobs", viewAllJobs);  // This route allows viewing all jobs

module.exports = router;

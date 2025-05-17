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
} = require("../controllers/adminController");

router.use(auth, roleCheck("admin"));

router.post("/jobs", createJob);
router.patch("/jobs/:id/limit", setJobLimit);
router.post("/jobs/:id/keywords", addKeywords);
router.get("/applications/:jobId", listApplications);
router.post("/filtered/:appId", pushToFiltered);
router.get("/filtered/export", exportFiltered);

module.exports = router;

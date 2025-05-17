const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const {
  listJobs,
  applyToJob,
} = require("../controllers/candidateController");

router.use(auth, roleCheck("candidate"));

router.get("/jobs", listJobs);
router.post("/apply/:jobId", applyToJob); // Upload + score CV

module.exports = router;

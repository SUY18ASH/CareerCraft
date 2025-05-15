// server/routes/atsRoutes.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// @route POST /api/ats/score
// @desc  Compute ATS score: % of job’s required skills present in resume
// @access Public (or auth-protected if you prefer)
router.post('/score', async (req, res) => {
  const { jobId, resumeText } = req.body;
  if (!jobId || !resumeText) {
    return res.status(400).json({ message: 'jobId and resumeText are required' });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // normalize
    const jobSkills = job.skills.map(s => s.toLowerCase());
    const text = resumeText.toLowerCase();

    // matched and missing
    const matched = jobSkills.filter(skill => text.includes(skill));
    const missing = jobSkills.filter(skill => !text.includes(skill));

    const score = Math.round((matched.length / jobSkills.length) * 100);

    res.json({ score, matched, missing });
  } catch (err) {
    console.error('ATS scoring error', err);
    res.status(500).json({ message: 'Server error during ATS scoring' });
  }
});

module.exports = router;

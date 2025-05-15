const express = require("express");
const Job = require("../models/Job");
const router = express.Router();

// ✅ Job Recommendation API with filtering
router.post("/recommend", async (req, res) => {
  const { skills } = req.body;
  if (!skills || skills.length === 0) {
    return res.status(400).json({ message: "No skills provided" });
  }
  try {
    const jobs = await Job.find();
    const recommendations = jobs
      .map((job) => {
        const jobSkills = job.skills || [];
        const lowerStudentSkills = skills.map((s) => s.toLowerCase());
        const lowerJobSkills = jobSkills.map((s) => s.toLowerCase());
        const matchedSkills = lowerJobSkills.filter((js) =>
          lowerStudentSkills.includes(js)
        );
        return { job, matchedSkillsCount: matchedSkills.length };
      })
      .filter((rec) => rec.matchedSkillsCount > 0)
      .sort((a, b) => b.matchedSkillsCount - a.matchedSkillsCount);

    const topJobs = recommendations.slice(0, 5).map((r) => r.job);
    res
      .status(200)
      .json({
        message: "Job recommendations generated successfully",
        recommendedJobs: topJobs,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error recommending jobs" });
  }
});

// ✅ Add Job Posting API
router.post("/add", async (req, res) => {
  try {
    const { title, company, description, location, skills } = req.body;

    if (!title || !company || !skills || !Array.isArray(skills)) {
      return res
        .status(400)
        .json({ message: "Missing required fields or invalid format" });
    }

    const job = new Job({ title, company, description, location, skills });
    await job.save();

    res.status(201).json({ message: "Job added successfully", job });
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ message: "Server error while adding job" });
  }
});

module.exports = router;
// This code defines a set of APIs for job recommendations and job postings in a Node.js application using Express. The `/recommend` endpoint generates job recommendations based on the skills provided in the request body, while the `/add` endpoint allows adding new job postings to the database. The code includes error handling and validation for required fields.

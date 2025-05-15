// server/routes/coverOpenRoutes.js
const express = require('express');
const axios = require('axios');
const Job = require('../models/Job');
const auth = require('../middlewares/authMiddleware');
require('dotenv').config();

const router = express.Router();
const HF_TOKEN = process.env.HF_API_TOKEN;
// pick a model that supports the free /models/ API:
const HF_MODEL = 'google/flan-t5-base';  

router.post('/open-generate', auth, async (req, res) => {
  const { jobId, resumeText, profile } = req.body;
  if (!jobId || !resumeText || !profile) {
    return res.status(400).json({ message: 'jobId, resumeText & profile required' });
  }

  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const prompt = `
Write a 200–250 word cover letter for:
Position: ${job.title} at ${job.company}
Candidate: ${profile.name} (${profile.email})
Skills: ${profile.skills.join(', ')}
Resume Text: ${resumeText}
  `;

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,  // :contentReference[oaicite:0]{index=0}
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_TOKEN}` }, timeout: 120000 }
    );

    // response.data is { generated_text: "…your letter…" }
    const coverLetter = (response.data.generated_text || '').trim();
    return res.json({ coverLetter, fromAI: true });
  } catch (err) {
    console.error('HF cover generation error:', err.response?.data || err.message);
    return res.status(500).json({ message: 'HF cover generation failed', detail: err.message });
  }
});

module.exports = router;

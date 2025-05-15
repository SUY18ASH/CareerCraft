// server/routes/coverRoutes.js (CommonJS version)
const express = require('express');
const OpenAI = require('openai').OpenAI || require('openai');
const Job = require('../models/Job');
const auth = require('../middlewares/authMiddleware');
require('dotenv').config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/generate', auth, async (req, res) => {
  const { jobId, resumeText, profile } = req.body;
  if (!jobId || !resumeText || !profile) {
    return res.status(400).json({ message: 'jobId, resumeText & profile required' });
  }

  let job;
  try {
    job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
  } catch (e) {
    return res.status(500).json({ message: 'Error fetching job', detail: e.message });
  }

  // first try AI
  try {
    const prompt = `
Write a concise (200–300 word) cover letter for:
Position: "${job.title}" at "${job.company}"

Candidate:
Name: ${profile.name}
Email: ${profile.email}
Skills: ${profile.skills.join(', ')}

Resume Text:
${resumeText}
    `;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    });
    const coverLetter = completion.choices[0].message.content.trim();
    return res.json({ coverLetter, fromAI: true });
  } catch (err) {
    console.error('OpenAI error, falling back to stub:', err);

    // fallback stub
    const stub = `
Dear Hiring Manager at ${job.company},

I am excited to apply for the ${job.title} position at ${job.company}. With my background in ${profile.skills.join(
      ', '
    )}, and hands‑on experience from my projects, I am confident I can contribute immediately to your team.

Highlights of my qualifications include:
• Proficient in ${profile.skills[0]} and ${profile.skills[1] || profile.skills[0]}  
• Strong problem‑solving skills demonstrated through my work on real‑world projects  
• Ability to learn new technologies quickly and adapt to evolving requirements  

I would welcome the opportunity to discuss how my skills and experiences align with ${job.company}’s needs. Thank you for your consideration.

Sincerely,  
${profile.name}
    `;
    return res.json({ coverLetter: stub.trim(), fromAI: false });
  }
});

module.exports = router;

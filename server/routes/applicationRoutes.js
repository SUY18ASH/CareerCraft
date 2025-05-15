const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const auth = require('../middlewares/authMiddleware'); // assume you have JWT middleware

// Apply to a job
router.post('/apply', auth, async (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.body;
  try {
    // Prevent duplicate
    const exists = await Application.findOne({ user: userId, job: jobId });
    if (exists) return res.status(400).json({ message: 'Already applied to this job' });
    
    const app = new Application({ user: userId, job: jobId });
    await app.save();
    res.status(201).json({ message: 'Application submitted', application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error applying to job' });
  }
});

// Get current user’s applications
router.get('/', auth, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id })
      .populate('job', 'title company location skills')
      .sort('-appliedAt');
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// Update status (optional admin)
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  if (!['Applied','Interview','Offer','Rejected'].includes(status))
    return res.status(400).json({ message: 'Invalid status' });
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: 'Status updated', application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating status' });
  }
});

module.exports = router;
// This code defines an Express router for handling job applications. It includes routes for applying to a job, fetching the current user's applications, and updating the status of an application. The routes use JWT authentication middleware to ensure that only authenticated users can access them. The code also includes error handling for various scenarios, such as duplicate applications and invalid status updates.
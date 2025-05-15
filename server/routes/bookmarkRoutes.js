const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');

// Add a bookmark
router.post('/add', auth, async (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user.bookmarks.includes(jobId)) {
      user.bookmarks.push(jobId);
      await user.save();
    }
    res.json({ message: 'Bookmarked', bookmarks: user.bookmarks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding bookmark' });
  }
});

// Remove a bookmark
router.post('/remove', auth, async (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.body;
  try {
    const user = await User.findById(userId);
    user.bookmarks = user.bookmarks.filter(id => id.toString() !== jobId);
    await user.save();
    res.json({ message: 'Removed bookmark', bookmarks: user.bookmarks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing bookmark' });
  }
});

// Get all bookmarks
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks');
    res.json(user.bookmarks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
});

module.exports = router;

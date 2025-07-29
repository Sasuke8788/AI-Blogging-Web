const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/post');
const verifyToken = require('../middleware/auth');

// Only accessible to logged-in users (extend later with admin check if needed)
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ isPremium: true });
    const totalPosts = await Post.countDocuments();
    const premiumPosts = await Post.countDocuments({ isPremium: true });

    res.json({
      totalUsers,
      premiumUsers,
      totalPosts,
      premiumPosts
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

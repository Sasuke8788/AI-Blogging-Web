const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authcontroller');
const verifyToken = require('../middleware/auth');
const User = require('../models/User');

// 🟢 Register
router.post('/register', register);

// 🟢 Login
router.post('/login', login);

// 🔐 Get current user profile (Protected)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

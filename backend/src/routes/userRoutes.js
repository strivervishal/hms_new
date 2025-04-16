const express = require("express");
const User = require("../models/User");
const authenticateUser = require("../middlewares/authMiddleware");
const router = express.Router();

// Route to fetch user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Use req.user.id
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
const User = require('../models/User'); // Import the User model

// Get user profile
exports.getUserProfile = async (req, res) => {
  const { userId } = req.query; // Get userId from the query parameters

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await User.findById(userId).select('-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Send the user data as a response
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { userId } = req.body; // Get userId from the request body
  const updatedProfile = req.body; // Get the updated profile data

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Find the user and update their profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedProfile },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser); // Send the updated user data as a response
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
};
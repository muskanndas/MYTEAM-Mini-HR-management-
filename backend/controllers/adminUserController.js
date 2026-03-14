import User from '../models/User.js';

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from database
    const users = await User.find({})
      .select('-password')  // Exclude password field
      .sort({ createdAt: -1 });  // Sort by newest first

    // Return user details
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User By ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by ID
    const user = await User.findById(userId).select('-password');

    // If user does not exist
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user details
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

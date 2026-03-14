import User from '../models/User.js';

const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get user id from authMiddleware
      const userId = req.userId;

      // Find user from database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user's role is allowed
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "Access denied. You do not have permission."
        });
      }

      // If role is allowed, proceed
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
};

export default roleMiddleware;

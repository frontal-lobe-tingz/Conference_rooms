// middleware/authMiddleware.js

const { User } = require('../models'); // Adjusted Import

const checkUserRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Extract user ID from headers (assuming you pass 'x-user-id' in the request headers)
      const userId = req.headers['x-user-id'];
      if (!userId) {
        return res.status(401).json({ message: 'User ID is missing from headers' });
      }

      // Find the user in the database
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Check if the user's role is in the list of allowed roles
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Attach user to the request object for further use
      req.user = user;
      next();
    } catch (error) {
      console.error('Error in role checking middleware:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = { checkUserRole };

const { verify } = require('jsonwebtoken');
const User = require('../Models/User');

const authenticateToken = async (req, res, next) => {
  let token;

  // Check if the token is present in the authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token is null' });
    }

    try {
      // Verify the token
      const decoded = verify(token, process.env.JWT_SECRET);

      // Fetch the user and attach it to the request object
      const user = await User.findById(decoded.id).select('-password');

      if (user) {
        req.user = user; // Attach user information to request
        next(); // Proceed to the next middleware or route handler
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      // Handle JWT verification errors
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Not authorized, token is malformed' });
      } else {
        return res.status(401).json({ message: 'Not authorized, token verification failed' });
      }
    }
  } else {
    // If no token is provided in the request
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

function authorize(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }
    next();
  };
}

module.exports = {
  authorize,
  authenticateToken
};

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user');
const dotenv = require('dotenv').config();

const verifyToken = promisify(jwt.verify);

const authenticateUser = async (req, res, next) => {
  // Check if the authorization header is present
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Extract the token from the authorization header
  const token = authorizationHeader.split(' ')[1];

  try {
    // Verify the token using the secret key
    const decoded = await verifyToken(token, process.env.JWT_SECRET);

    // Fetch the user based on the decoded token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user object to the request for further use in the route handlers
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = authenticateUser;

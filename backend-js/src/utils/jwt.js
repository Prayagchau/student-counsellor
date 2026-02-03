const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 */
const generateToken = (userId, email, role) => {
  const payload = {
    id: userId,
    email,
    role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Verify JWT Token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

/**
 * Decode Token Without Verification
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};

// utils/token.js
const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = { id: user._id, role: user.role, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
}

module.exports = { generateToken };

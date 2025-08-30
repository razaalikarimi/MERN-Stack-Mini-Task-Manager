// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id).select('-password');
    if(!user) return res.status(401).json({ message: 'Invalid token - user not found' });
    req.user = user;
    next();
  } catch(err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if(!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if(req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

module.exports = { authMiddleware, requireRole };

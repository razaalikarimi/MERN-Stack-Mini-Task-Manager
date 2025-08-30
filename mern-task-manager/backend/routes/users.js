// routes/users.js
const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const User = require('../models/User');
const { body } = require('express-validator');
const { checkValidation } = require('../middleware/validate');

const router = express.Router();

// admin only: get users (simple)
router.get('/', authMiddleware, requireRole('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { next(err); }
});

// admin only: patch role
router.patch('/:id/role',
  authMiddleware,
  requireRole('admin'),
  body('role').isIn(['member','admin']),
  checkValidation,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
      if(!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) { next(err); }
  });

module.exports = router;

// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/token');
const { checkValidation } = require('../middleware/validate');

const router = express.Router();

// register
router.post('/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  checkValidation,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email already in use' });
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed });
      const token = generateToken(user);
      res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
    } catch (err) { next(err); }
  });

// login
router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  checkValidation,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
      const token = generateToken(user);
      res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
    } catch (err) { next(err); }
  });

// logout (client clears token)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out (client should discard token)' });
});

module.exports = router;

// routes/stats.js
const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

// GET /stats/overview
router.get('/overview', authMiddleware, async (req, res, next) => {
  try {
    // If member: stats only for their tasks
    const match = {};
    if (req.user.role === 'member') {
      const uid = req.user._id;
      match.$or = [{ createdBy: uid }, { assignee: uid }];
    }
    const now = new Date();

    const countByStatus = await Task.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const countByPriority = await Task.aggregate([
      { $match: match },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const overdue = await Task.countDocuments({
      ...match,
      dueDate: { $lt: now },
      status: { $ne: 'done' }
    });

    res.json({ countByStatus, countByPriority, overdue });
  } catch (err) { next(err); }
});

module.exports = router;

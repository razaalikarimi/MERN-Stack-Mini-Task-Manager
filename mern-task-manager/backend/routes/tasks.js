// routes/tasks.js
const express = require('express');
const { body, query } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const { checkValidation } = require('../middleware/validate');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const User = require('../models/User');

const router = express.Router();

// Create task
router.post('/',
  authMiddleware,
  body('title').notEmpty(),
  checkValidation,
  async (req, res, next) => {
    try {
      const { title, description, status, priority, dueDate, tags, assignee } = req.body;
      // If member, they can only create tasks assigned to themselves or no assignee
      if (req.user.role === 'member' && assignee && assignee !== String(req.user._id)) {
        return res.status(403).json({ message: 'Members can assign tasks only to themselves' });
      }
      const createdBy = req.user._id;
      const task = await Task.create({ title, description, status, priority, dueDate, tags, assignee, createdBy });
      await Activity.create({ task: task._id, action: 'created', performedBy: req.user._id });
      res.status(201).json(task);
    } catch (err) { next(err); }
  });

// GET /tasks with filters, pagination, sort
router.get('/',
  authMiddleware,
  // optional query validators
  async (req, res, next) => {
    try {
      let { page = 1, limit = 10, search, status, priority, tags, assignee, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      page = parseInt(page); limit = parseInt(limit);
      const filter = {};
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (tags) filter.tags = { $in: tags.split(',') };
      if (assignee) filter.assignee = assignee;

      // Members see only their own tasks (createdBy or assigned to them)
      if (req.user.role === 'member') {
        const userId = req.user._id;
        filter.$or = filter.$or ? filter.$or.concat([{ createdBy: userId }, { assignee: userId }]) : [{ createdBy: userId }, { assignee: userId }];
      }

      const sortObj = {};
      sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const total = await Task.countDocuments(filter);
      const tasks = await Task.find(filter)
        .populate('assignee', 'name email')
        .populate('createdBy', 'name email')
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit);

      res.json({ tasks, total, page, pages: Math.ceil(total / limit) });
    } catch (err) { next(err); }
  });

// get one
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignee createdBy', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // check permission
    if (req.user.role === 'member') {
      const uid = String(req.user._id);
      if (String(task.createdBy._id) !== uid && (!task.assignee || String(task.assignee._id) !== uid)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }
    res.json(task);
  } catch (err) { next(err); }
});

// update
router.patch('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({ message: 'Task not found' });

    // permission: admin or creator only (members can only CRUD their tasks)
    if (req.user.role === 'member' && String(task.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Members can only edit their own tasks' });
    }

    // if member tries to change assignee to someone else - forbidden
    if (req.user.role === 'member' && req.body.assignee && req.body.assignee !== String(req.user._id)) {
      return res.status(403).json({ message: 'Members can assign tasks only to themselves' });
    }

    const before = task.toObject();
    Object.assign(task, req.body);
    await task.save();
    await Activity.create({ task: task._id, action: 'updated', performedBy: req.user._id, changes: { before, after: task }});
    res.json(task);
  } catch (err) { next(err); }
});

// delete
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role === 'member' && String(task.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Members can only delete their own tasks' });
    }
    await task.remove();
    await Activity.create({ task: task._id, action: 'deleted', performedBy: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

// get activity log for a task
router.get('/:id/activity', authMiddleware, async (req, res, next) => {
  try {
    const activities = await Activity.find({ task: req.params.id }).populate('performedBy', 'name email').sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) { next(err); }
});

module.exports = router;

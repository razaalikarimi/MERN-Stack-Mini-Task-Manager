// models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  action: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changes: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);

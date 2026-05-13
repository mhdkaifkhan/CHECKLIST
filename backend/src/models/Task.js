const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  targetMinutes: { type: Number, required: true, min: 1, max: 1440 },
  color: {
    type: String,
    default: '#f59e0b',
    enum: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f97316', '#06b6d4', '#ec4899'],
  },
  icon: { type: String, default: '📋' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

taskSchema.index({ user: 1, order: 1 });

module.exports = mongoose.model('Task', taskSchema);

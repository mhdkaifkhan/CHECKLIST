const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  taskTitle: { type: String, required: true },
  taskColor: { type: String, default: '#f59e0b' },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  durationSeconds: { type: Number, default: 0 },
  targetMinutes: { type: Number, required: true },
}, { _id: true });

const taskProgressSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  taskTitle: { type: String, required: true },
  taskColor: { type: String, default: '#f59e0b' },
  targetMinutes: { type: Number, required: true },
  completedSeconds: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
}, { _id: false });

const dayRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, required: true },
  targetMinutes: { type: Number, default: 0 },
  completedSeconds: { type: Number, default: 0 },
  completionPercent: { type: Number, default: 0 },
  allTasksCompleted: { type: Boolean, default: false },
  streakCounted: { type: Boolean, default: false },
  sessions: [sessionSchema],
  taskProgress: [taskProgressSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'failed', 'skipped'],
    default: 'active',
  },
}, {
  timestamps: true,
});

dayRecordSchema.index({ user: 1, date: 1 }, { unique: true });
dayRecordSchema.index({ user: 1, status: 1 });

dayRecordSchema.pre('save', function (next) {
  if (this.targetMinutes > 0) {
    this.completionPercent = Math.min(
      100,
      Math.round((this.completedSeconds / (this.targetMinutes * 60)) * 100)
    );
  }
  this.allTasksCompleted = this.taskProgress.length > 0 &&
    this.taskProgress.every(tp => tp.isCompleted);
  next();
});

module.exports = mongoose.model('DayRecord', dayRecordSchema);

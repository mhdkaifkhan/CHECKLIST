const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String, default: '' },
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: null },
  targetHours: { type: Number, default: 8 },
  theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
  timezone: { type: String, default: 'UTC' },
}, {
  timestamps: true,
});

userSchema.virtual('initials').get(function () {
  return this.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);

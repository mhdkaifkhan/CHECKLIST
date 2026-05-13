const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, required: true },
  content: { type: String, default: '' },
  screenshot: {
    url: { type: String, default: null },
    publicId: { type: String, default: null },
  },
  mood: { type: String, enum: ['great', 'good', 'okay', 'bad', null], default: null },
}, {
  timestamps: true,
});

noteSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Note', noteSchema);

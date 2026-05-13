const Note = require('../models/Note');
const { cloudinary } = require('../middleware/upload');
const { getTodayDate } = require('../utils/streakCalculator');

const getNote = async (req, res, next) => {
  try {
    const date = req.params.date || getTodayDate();
    const note = await Note.findOne({ user: req.user._id, date });
    res.json({ note: note || null });
  } catch (err) {
    next(err);
  }
};

const upsertNote = async (req, res, next) => {
  try {
    const date = req.params.date || getTodayDate();
    const { content, mood } = req.body;

    const note = await Note.findOneAndUpdate(
      { user: req.user._id, date },
      { content, mood },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ note });
  } catch (err) {
    next(err);
  }
};

const uploadScreenshot = async (req, res, next) => {
  try {
    const date = req.params.date || getTodayDate();
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const existing = await Note.findOne({ user: req.user._id, date });
    if (existing?.screenshot?.publicId) {
      await cloudinary.uploader.destroy(existing.screenshot.publicId).catch(() => {});
    }

    const note = await Note.findOneAndUpdate(
      { user: req.user._id, date },
      {
        screenshot: {
          url: req.file.path,
          publicId: req.file.filename,
        },
      },
      { new: true, upsert: true }
    );

    res.json({ note });
  } catch (err) {
    next(err);
  }
};

const deleteScreenshot = async (req, res, next) => {
  try {
    const date = req.params.date || getTodayDate();
    const note = await Note.findOne({ user: req.user._id, date });

    if (note?.screenshot?.publicId) {
      await cloudinary.uploader.destroy(note.screenshot.publicId).catch(() => {});
    }

    await Note.findOneAndUpdate(
      { user: req.user._id, date },
      { screenshot: { url: null, publicId: null } },
      { upsert: true }
    );

    res.json({ message: 'Screenshot removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNote, upsertNote, uploadScreenshot, deleteScreenshot };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const googleCallback = (req, res) => {
  const token = generateToken(req.user._id);
  const frontendUrl = process.env.FRONTEND_URL || 'https://checklist-ten-sigma.vercel.app';
  res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
};

const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const { theme, targetHours, timezone } = req.body;
    const update = {};
    if (theme) update.theme = theme;
    if (targetHours) update.targetHours = Number(targetHours);
    if (timezone) update.timezone = timezone;

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
};

module.exports = { googleCallback, getMe, updatePreferences, logout };

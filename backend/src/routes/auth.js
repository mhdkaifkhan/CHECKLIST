const express = require('express');
const passport = require('passport');
const { googleCallback, getMe, updatePreferences, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/?error=auth_failed`, session: false }),
  googleCallback
);

router.get('/me', protect, getMe);
router.put('/preferences', protect, updatePreferences);
router.post('/logout', protect, logout);

module.exports = router;

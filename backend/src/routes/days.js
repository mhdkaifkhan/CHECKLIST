const express = require('express');
const { getToday, startSession, stopSession, getHistory, getHeatmapData } = require('../controllers/dayController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/today', getToday);
router.post('/session/start', startSession);
router.post('/session/stop', stopSession);
router.get('/history', getHistory);
router.get('/heatmap', getHeatmapData);

module.exports = router;

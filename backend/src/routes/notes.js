const express = require('express');
const { getNote, upsertNote, uploadScreenshot, deleteScreenshot } = require('../controllers/noteController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/:date', getNote);
router.put('/:date', upsertNote);
router.post('/:date/screenshot', upload.single('screenshot'), uploadScreenshot);
router.delete('/:date/screenshot', deleteScreenshot);

module.exports = router;

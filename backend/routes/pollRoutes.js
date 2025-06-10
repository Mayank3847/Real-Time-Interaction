const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes
router.post('/', asyncHandler(pollController.createPoll));
router.get('/:sessionCode', asyncHandler(pollController.getPoll));
router.get('/history', asyncHandler(pollController.getPollHistory));

module.exports = router;
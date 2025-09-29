const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit', feedbackController.submitFeedback);
router.get('/', protect, feedbackController.getFeedback);

module.exports = router;
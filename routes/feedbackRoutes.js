const express = require('express');
const router = express.Router();
const { handlePostFeedback, handleGetFeedback } = require('../controllers/feedbackController');

router.post('/feedback', handlePostFeedback);
router.get('/feedback', handleGetFeedback);

module.exports = router;

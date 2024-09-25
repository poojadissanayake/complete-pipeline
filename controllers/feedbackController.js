const { insertFeedback, getAllFeedback } = require('../models/feedbackModel');

async function handlePostFeedback(req, res) {
  const { name, email, review } = req.body;

  try {
    await insertFeedback(name, email, review);
    res.status(200).json({ message: 'Thank you for your feedback!' });
  } catch (error) {
    res.status(500).json({ message: 'Error occurred!', error });
  }
}

async function handleGetFeedback(req, res) {
  try {
    const feedbackList = await getAllFeedback();
    res.status(200).json(feedbackList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error });
  }
}

module.exports = {
  handlePostFeedback,
  handleGetFeedback
};

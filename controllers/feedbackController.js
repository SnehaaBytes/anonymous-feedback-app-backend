const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  const { recipient, text } = req.body;
  if (!recipient || !text) {
    return res.status(400).json({ message: 'Recipient and text are required.' });
  }
  try {
    const anonymousId = new Date().getTime().toString();
    const newFeedback = new Feedback({
      recipient,
      text,
      anonymousId
    });
    const savedFeedback = await newFeedback.save();
    res.status(201).json({
      message: 'Feedback received successfully!',
      feedback: savedFeedback
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Server error. Could not save feedback.' });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const userId = req.user;
    const feedbacks = await Feedback.find({ recipient: userId }).sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error. Could not fetch feedback.' });
  }
};
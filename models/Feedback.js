const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  sentiment: {
    type: String,
    enum: ['Positive', 'Negative', 'Neutral', 'N/A'],
    default: 'N/A'
  },
  anonymousId: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
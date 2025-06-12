const Poll = require('../models/Poll');

// Helper to generate 6-character alphanumeric session code
function generateSessionCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Create a new poll
const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Invalid poll data. Must include question and at least 2 options.' });
    }

    const newPoll = new Poll({
      question: question.trim(),
      options: options.map(text => ({ text: text.trim(), votes: 0 })),
      sessionCode: generateSessionCode()
    });

    const savedPoll = await newPoll.save();

    return res.status(201).json({
      pollId: savedPoll._id,
      question: savedPoll.question,
      options: savedPoll.options,
      sessionCode: savedPoll.sessionCode,
      createdAt: savedPoll.createdAt
    });
  } catch (error) {
    console.error('[Create Poll Error]', error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
};

// Fetch poll by session code
const getPoll = async (req, res) => {
  try {
    const { sessionCode } = req.params;
    const poll = await Poll.findOne({ sessionCode: sessionCode.toUpperCase() });

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
};

// Fetch recent poll history (last 10 polls)
const getPollHistory = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch poll history' });
  }
};

module.exports = {
  createPoll,
  getPoll,
  getPollHistory
};

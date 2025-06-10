const Poll = require('../models/Poll'); // Assuming you have a Poll model

const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    
    if (!question || !options || !Array.isArray(options)) {
      return res.status(400).json({ error: 'Invalid poll data' });
    }

    const newPoll = new Poll({
      question,
      options: options.map(option => ({
        text: option,
        votes: 0
      })),
      sessionCode: generateSessionCode() // Implement this function
    });

    const savedPoll = await newPoll.save();
   res.status(201).json({
  pollId: savedPoll._id,
  question: savedPoll.question,
  options: savedPoll.options,
  sessionCode: savedPoll.sessionCode,
  createdAt: savedPoll.createdAt
});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPoll = async (req, res) => {
  try {
    const { sessionCode } = req.params;
    const poll = await Poll.findOne({ sessionCode });

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPollHistory = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function (implement as needed)
function generateSessionCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

module.exports = {
  createPoll,
  getPoll,
  getPollHistory
};
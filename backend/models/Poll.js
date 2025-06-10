const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: [true, 'Option text is required'],
    trim: true,
    minlength: [1, 'Option text cannot be empty']
  },
  votes: { 
    type: Number, 
    default: 0,
    min: [0, 'Votes cannot be negative']
  }
});

const pollSchema = new mongoose.Schema({
  sessionCode: { 
    type: String, 
    required: [true, 'Session code is required'],
    unique: true,
    index: true,
    uppercase: true,
    validate: {
      validator: (code) => /^[A-Z0-9]{6}$/.test(code),
      message: 'Invalid session code format'
    }
  },
  question: { 
    type: String, 
    required: [true, 'Question is required'],
    trim: true,
    minlength: [3, 'Question must be at least 3 characters']
  },
  options: {
    type: [optionSchema],
    validate: {
      validator: (options) => options.length >= 2,
      message: 'At least 2 options are required'
    }
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: '24h' // Auto-delete after 24h
  }
});

// Add index for faster queries
pollSchema.index({ sessionCode: 1, active: 1 });

module.exports = mongoose.model('Poll', pollSchema);
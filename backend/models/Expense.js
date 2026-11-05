const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Accommodation', 'Transportation', 'Food & Dining', 'Activities', 'Shopping', 'Emergency', 'Other'],
    default: 'Food & Dining'
  },
  paidBy: {
    type: String,
    default: 'You'
  },
  splitType: {
    type: String,
    enum: ['Equally', 'Custom', 'Individual'],
    default: 'Equally'
  },
  splitAmong: {
    type: [String],
    default: []
  },
  isAnomaly: {
    type: Boolean,
    default: false
  },
  anomalyScore: {
    type: Number,
    default: 0
  },
  anomalyReason: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);

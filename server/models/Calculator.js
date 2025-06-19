const mongoose = require('mongoose');

const CalculatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['mortgage', 'carLoan', 'consumerLoan', 'pension'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  minAmount: {
    type: Number,
    required: true
  },
  maxAmount: {
    type: Number,
    required: true
  },
  minTerm: {
    type: Number,
    required: true
  },
  maxTerm: {
    type: Number,
    required: true
  },
  minDownPayment: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Calculator', CalculatorSchema); 
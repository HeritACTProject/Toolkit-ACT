const mongoose = require('mongoose');

const actionSchema = mongoose.Schema({
  targetId: {
    type: String,
    required: true,
  },
  actionId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  indicators: [{
    type: String,
  }],
});

// Export Action Model
module.exports = mongoose.model('action', actionSchema);

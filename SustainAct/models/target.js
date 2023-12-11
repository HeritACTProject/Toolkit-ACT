const mongoose = require('mongoose');

const targetSchema = mongoose.Schema({
  goal: {
    type: String,
    required: true,
  },
  target: {
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
  tags: [{
    type: String,
  }],
  id: {
    type: String,
  },
  policies {
    type: Object,
  },
});

// Export Target Model
module.exports = mongoose.model('target', targetSchema);

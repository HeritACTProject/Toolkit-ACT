const mongoose = require('mongoose');

const assessmentSchema = mongoose.Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
  },
  owner: {
    type: String,
  },
  ownerType: {
    type: [String],
  },
  overview: {
    type: String,
  },
  objectives: {
    type: String,
  },
  type: {
    type: [String],
  },
  status: {
    type: String,
  },
  location: {
    type: [String],
  },
  selectedTags: {
    type: [String],
  },
  selectedTargets: {
    type: [Object],
  },
  selectedActions: {
    type: [String],
  },
  expireAt: {
   type: Date,
   default: Date.now() + 24 * 60 * 60 * 1000   // expires in 24 hours
  }
},
{
  toObject: {
    virtuals: true,
  },
}, {
  versionKey: false,
});

// Export Organisation Model
module.exports = mongoose.model('assessment', assessmentSchema);

const mongoose = require('mongoose');
const mongooseIntl = require('mongoose-intl');

const subgroupSchema = mongoose.Schema({
  name: {
    type: String,
  },
  id: {
    type: String,
  },
  tags: {
    type: [Object],
  },
});

const tagGroupSchema = mongoose.Schema({
  description: {
    type: String,
  },
  subGroups: {
    type: [subgroupSchema],
  },
  groupName: {
    type: String,
    intl: true,
  },
  groupId: {
    type: String,
  },
  order: {
    type: String,
  },
}, {
  toObject: {
    virtuals: true,
  },
});

tagGroupSchema.plugin(mongooseIntl, { languages: ['en', 'el'], defaultLanguage: 'en' });

// Export Tag Model
module.exports = mongoose.model('tagGroup', tagGroupSchema, 'tagGroups');

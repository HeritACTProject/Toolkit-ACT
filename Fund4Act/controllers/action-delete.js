const Action = require('../models/actions.js');

exports.deleteActionBySlug = async (slug, profileId) => {
  await Action.deleteActionBySlug(slug, profileId);
};

const Target = require('../models/target');

exports.getTargetsObjects = async (selectedTagIds) => {
  const targets = await Target.find({ tags: { $in: selectedTagIds } }).sort('id').collation({ locale: 'en_US', numericOrdering: true }).exec();
  return targets.map((target) => target.toObject());
};

exports.getAllTargets = async () => {
  const targets = await Target.find().sort('id').collation({ locale: 'en_US', numericOrdering: true }).exec();
  return targets.map((target) => target.toObject());
};

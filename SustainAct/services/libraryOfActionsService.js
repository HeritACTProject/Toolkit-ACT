const Action = require('../models/action');

exports.getActionsByTargetIds = async (targets, industry) => {
  const targetIds = targets.map((target) => target.id);
  return Action.find({
    $and: [
      { targetId: { $in: targetIds } },
      { $or: [{ industry }, { industry: 'all' }] },
    ],
  }).lean().exec();
};

exports.getActionsByActionIds = async (actionIds) => Action.find(
  { actionId: { $in: actionIds } },
).lean().exec();

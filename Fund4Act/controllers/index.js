const action = require('../models/actions.js');
const Pledge = require('../models/pledges.js');

exports.get = async (req, res, next) => {
  try {
    const actions = action.getAllCoordinatesAndSlugs();
    let mostUrgent = action.getXMostUrgent(3);
    mostUrgent = await Promise.all(mostUrgent.map(async (action)=>{
      const pledges = await Pledge.getByActionSlug(action.slug);
      action.total_pledged = pledges.reduce((a, {amount}) => a + amount, 0);
      return action;
    }));

    return {
      mostUrgent,
      actions,
    }
  } catch (err) {
    res.status(500).json({ errors: err.array });
    next(err);
  }
};

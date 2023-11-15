const action = require('../models/actions.js');

exports.get = async (req, res, next) => {
  try {
    const mostUrgent = action.getXMostUrgent(3);

    return {
      mostUrgent,
    }
  } catch (err) {
    res.status(500).json({ errors: err.array });
    next(err);
  }
};

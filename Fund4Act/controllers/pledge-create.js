const { param, body, validationResult } = require('express-validator');
const pledge = require('../models/pledges.js');

exports.post = [
  [
    body('amount').notEmpty().isNumeric(),
  ], async (req, res, next) => {
    const data = {
      proj_slug: req.params.slug,
      donor_id: req.user.id,
      amount: req.body.amount,
    };

    try {
      validationResult(req.params, req.body).throw();
    } catch (err) {
      res.status(400).json({ errors: err.array });
      next(err);
    }
    try {
      await pledge.create(data);
    } catch (err) {
      res.status(500).json({ errors: err.array });
      next(err);
    }

    return next();
  }];

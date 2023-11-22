const { param, body, validationResult } = require('express-validator');
const profile = require('../models/profiles.js');

exports.post = [
  [
    body('logo-url').trim().escape(),
    body('website-url').trim().escape(),
    body('mission').notEmpty().trim().escape(),
    body('prev-actions').trim().escape(),
    body('prev-grants').trim().escape(),
    body('partnerships').notEmpty().escape(),
    body('constitution-url').notEmpty().trim().escape(),
    body('cap-url').notEmpty().trim().escape(),
  ], async (req, res, next) => {
    const formData = {
      id: req.user.id,
      email: req.body.email,
      logoUrl: req.body['logo-url'],
      websiteUrl: req.body['website-url'],
      mission: req.body.mission,
      prevActions: req.body['prev-actions'],
      prevGrants: req.body['prev-grants'],
      partnerships: req.body.partnerships,
      constitutionUrl: req.body['constitution-url'],
      climateActionPlanUrl: req.body['cap-url'],
    };

    try {
      validationResult(req.params, req.body).throw();
    } catch (err) {
      res.status(400).json({ errors: err.array });
      next(err);
    }
    try {
      await profile.saveOrgInfo(formData);
    } catch (err) {
      res.status(500).json({ errors: err.array });
      next(err);
    }

    next();
  }];

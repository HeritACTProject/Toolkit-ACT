const { param, body, validationResult } = require('express-validator');
const organisation = require('../models/organisations.js');

exports.post = [
  [
    body('name').notEmpty().trim().escape(),
    body('logo-url').trim().escape(),
    body('website-url').trim().escape(),
    body('mission').trim().escape(),
    body('prev-projects').trim().escape(),
    body('prev-grants').trim().escape(),
    body('partnerships').notEmpty().escape(),
  ], async (req, res, next) => {
    const formData = {
      id: req.user.id,
      name: req.body.name,
      email: req.body.email,
      logoUrl: req.body['logo-url'],
      websiteUrl: req.body['website-url'],
      mission: req.body.mission,
      prevProjects: req.body['prev-projects'],
      prevGrants: req.body['prev-grants'],
      partnerships: req.body.partnerships,
    };

    try {
      validationResult(req.params, req.body).throw();
    } catch (err) {
      res.status(400).json({ errors: err.array });
      next(err);
    }
    try {
      await organisation.save(formData);
    } catch (err) {
      res.status(500).json({ errors: err.array });
      next(err);
    }

    return next();
  }];

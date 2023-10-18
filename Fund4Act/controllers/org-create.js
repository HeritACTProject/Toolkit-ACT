const { param, body, validationResult } = require('express-validator');
const organisation = require('../models/organisations.js');

exports.get = [
  [
    param('organisation').notEmpty().trim().escape(),
  ], async ({ params, query, ...req }, res) => {
    validationResult(req).throw();
    if (!hasActionPemissions(req.decodedClaims)) res.redirect('/pricing');
    let existingData;

    if (query.edit === 'true') {
      const action = await getAction(params.organisation, params.action);
      // eslint-disable-next-line no-underscore-dangle
      existingData = { ...action._doc };
    }

    res.render('actionInfo', {
      layout: 'layout',
      countries,
      domain: process.env.DOMAIN,
      csrfToken: req.csrfToken(),
      edit: query.edit,
      existingData,
    });
  }];

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

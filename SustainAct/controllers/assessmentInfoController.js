const { param, body, validationResult } = require('express-validator');
const { getassessment, saveAssessmentInfo } = require('../services/assessmentService');
const { countries } = require('../tools/countries');

exports.get = [
  [
  ], async ({ params, query, ...req }, res) => {
    validationResult(req).throw();

    res.render('assessmentInfo', {
      layout: 'layout',
      countries,
      domain: process.env.DOMAIN,
      csrfToken: req.csrfToken(),
    });
  }];

exports.post = [
  [
    body('assessmentName').notEmpty().trim(),
    body('assessmentOwner').trim(),
    body('assessmentOwnerType'),
    body('assessmentObjectives').trim(),
    body('assessmentOverview').trim(),
    body('assessmentType').notEmpty(),
    body('assessmentStatus').trim().notEmpty(),
    body('assessmentLocation').notEmpty(),
  ], async ({ decodedClaims, ...req }, res, next) => {
    try {
      validationResult(req.params, req.body).throw();
      const formData = {
        name: req.body.assessmentName,
        owner: req.body.assessmentOwner,
        ownerType: req.body.assessmentOwnerType,
        overview: req.body.assessmentOverview,
        objectives: req.body.assessmentObjectives,
        type: req.body.assessmentType,
        status: req.body.assessmentStatus,
        location: req.body.assessmentLocation,
      };

      const assesment = await saveAssessmentInfo(formData);
      res.redirect(`/app/${assesment.id}/tags?edit=true`);
    } catch (err) {
      res.status(400).json({ errors: err.array });
      next(err);
    }
  }];

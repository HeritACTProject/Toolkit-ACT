const { param, validationResult } = require('express-validator');
const TagsService = require('../services/tagsService');
const assessmentService = require('../services/assessmentService');

exports.get = [
  [
    param('assessment').notEmpty().trim().escape(),
  ], async (req, res) => {
    validationResult(req).throw();
    const tagGroupObjects = await TagsService.getTagGroupObjects();
    const { token, edit: isEdit } = req.query;
    const { assessment } = req.params;
    let selectedTags = [];

    res.render('tags', {
      layout: 'layout',
      domain: process.env.DOMAIN,
      tagGroups: tagGroupObjects,
      token,
      csrfToken: req.csrfToken(),
    });
  }];

exports.post = [
  [
    param('assessment').notEmpty().trim().escape(),
  ],
  async (req, res) => {
    try {
      validationResult(req).throw();
      const assessmentId = req.params.assessment;

      await assessmentService.saveSelectedTags(
        assessmentId,
        req.body.tags,
      );

      res.redirect(`/app/${assessmentId}/targets`);
    } catch (err) {
      console.log(err)
      res.status(422).json({ errors: err });
    }
  },
];

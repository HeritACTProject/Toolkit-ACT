const { param, body, validationResult } = require('express-validator');
const slug = require('slug');
const { nanoid } = require('nanoid');
const project = require('../models/projects.js');
const request = require('request-promise');

exports.post = [
  [
    body('name').trim().notEmpty().escape(),
    body('target').notEmpty().isNumeric().toFloat(),
    body('deadline').notEmpty().isISO8601(),
    body('image-url').trim().escape(),
    body('address').trim().escape(),
    body('overview').trim().escape(),
    body('start-date').notEmpty().isISO8601(),
    body('end-date').notEmpty().isISO8601(),
    body('category').trim().escape(),
    body('audience').trim().escape(),
  ], async (req, res, next) => {
    const data = {
      orgId: req.user.id,
      name: req.body.name,
      target: req.body.target,
      deadline: req.body.deadline,
      imageUrl: req.body["image-url"],
      address: req.body.address,
      overview: req.body.overview,
      startDate: req.body["start-date"],
      endDate: req.body["end-date"],
      category: req.body.category,
      audience: req.body.audience,
    };

    try {
      validationResult(req.params, req.body).throw();
    } catch (err) {
      res.status(400).json({ errors: err.array });
      next(err);
    }
    try {
      data.slug = slug(`${data.name}-${nanoid(6)}`);
      const nominatimResponse = await request(`https://nominatim.openstreetmap.org/search?q=${data.address}&format=json`);
      const geocode = JSON.parse(nominatimResponse)[0];
      data.lat = geocode.lat;
      data.lon = geocode.lon;
      await project.create(data);
    } catch (err) {
      res.status(500).json({ errors: err.array });
      next(err);
    }

    return next();
  }];

const { param, body, validationResult } = require('express-validator');
const slug = require('slug');
const { nanoid } = require('nanoid');
const action = require('../models/actions.js');
const { getAmbitionLevels }= require('../services/new-european-bauhaus.js');
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
  ], async (req, res, next) => {

    const data = {
      profileId: req.user.id,
      name: req.body.name,
      total: req.body.total,
      target: req.body.target,
      deadline: req.body.deadline,
      imageUrl: req.body["image-url"],
      address: req.body.address,
      overview: req.body.overview,
      startDate: req.body["start-date"],
      endDate: req.body["end-date"],
      category: req.body.category,
    };

    try {
      validationResult(req.params, req.body).throw();
    } catch (err) {
      res.status(400).json({ errors: err.array });
      next(err);
    }

    const ambitionInputs = {
      beautyAmbitionInput: req.body['beauty_ambition'],
      sustainAmbitionInput: req.body['sustain_ambition'],
      togetherAmbitionInput: req.body['together_ambition'],
      participAmbitionInput: req.body['particip_ambition'],
      multiLevelEngagementAmbitionInput: req.body['multi_level_engagement'],
      transdiciplinaryAmbitionInput: req.body.transdiciplinary,
    };

    const nebData = await getAmbitionLevels(ambitionInputs);

    data.beautyAmbition = nebData.beautyAmbition;
    data.sustainAmbition = nebData.sustainAmbition;
    data.togetherAmbition = nebData.togetherAmbition;
    data.participProcessAmbition = nebData.participProcessAmbition;
    data.multiLevelEngagementAmbition = nebData.multiLevelEngagementAmbition;
    data.transdiciplinaryAmbition = nebData.transdiciplinaryAmbition;

    let nominatimResponse, geocode;

    try {
      nominatimResponse = await request(`https://nominatim.openstreetmap.org/search?q=${data.address}&format=json`);
      geocode = await JSON.parse(nominatimResponse)[0];
      if (!geocode.lat) throw Error();
    } catch (err) {
      res.render('action-create-form', {locationError: true});
      return;
    }

    try {
      data.slug = slug(`${data.name}-${nanoid(6)}`);
      data.lat = geocode.lat;
      data.lon = geocode.lon;
      await action.create(data);
    } catch (err) {
      res.status(500).json({ errors: err.array });
      next(err);
    }

    return res.redirect('/profile');
  }];

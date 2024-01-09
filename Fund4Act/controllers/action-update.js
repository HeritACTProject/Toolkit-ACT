const { param, body, validationResult } = require('express-validator');
const Action = require('../models/actions.js');
const { getAmbitionLevels }= require('../services/new-european-bauhaus.js');
const request = require('request-promise');

const locationSearch = async (query) => {
  const nominatimResponse = await request(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);
  const geocode = await JSON.parse(nominatimResponse)[0];
  if (!geocode.lat) throw Error();
  return [geocode.lat, geocode.lon];
}

exports.updateInfoBySlug = [
  [
    body('name').trim().notEmpty().escape(),
    body('address').trim().escape(),
    body('overview').trim().escape(),
    body('start-date').notEmpty().isISO8601(),
    body('end-date').notEmpty().isISO8601(),
    body('category').trim().escape(),
  ], async (req, res, next) => {

    const data = {
      profileId: req.user.id,
      name: req.body.name,
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

    var lat = req.body.lat;
    var lon = req.body.lon;

    try {
      if (lat === undefined || lon === undefined) {
        const latlon = await locationSearch(data.address);
        lat = latlon[0];
        lon = latlon[1];
      }
    } catch (err) {
      res.render('action-create-form', {locationError: true});
      return;
    }

    try {
      data.lat = lat;
      data.lon = lon;
      await Action.updateInfoBySlug(req.params.slug, data);
    } catch (err) {
      res.status(500).json({ errors: err.array });
      next(err);
    }

    res.redirect(`/action/${req.params.slug}/edit/impact`)
  }];

exports.updateAmbitionsBySlug = [
  [
    body('beauty_ambition').trim().escape(),
    body('sustain_ambition').trim().escape(),
    body('together_ambition').trim().escape(),
    body('particip_ambition').trim().escape(),
    body('multi_level_engagement').trim().escape(),
    body('transdiciplinary').trim().escape(),
  ], async (req, res, next) => {

    try {
      validationResult(req.params, req.body).throw();
    } catch (err) {
      res.status(400).json({ errors: err.array });
      next(err);
    }

    const data = {
      profileId: req.user.id,
    };

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

    try {
      await Action.updateAmbitionsBySlug(req.params.slug, data);
    } catch (err) {
      res.status(500).json({ errors: err.array });
      next(err);
    }

    res.redirect(`/action/${req.params.slug}/edit/funding`)
  }];

exports.updateFundingBySlug = [
  [
    body('target').notEmpty().isNumeric().toFloat(),
    body('total').notEmpty().isNumeric().toFloat(),
    body('deadline').notEmpty().isISO8601(),
  ], async (req, res, next) => {

    const data = {
      profileId: req.user.id,
      total: req.body.total,
      target: req.body.target,
      deadline: req.body.deadline,
    };

    try {
      validationResult(req.params, req.body).throw();
    } catch (err) {
      res.status(400).json({ errors: err.array });
      next(err);
    }

    try {
      await Action.updateFundingBySlug(req.params.slug, data);
    } catch (err) {
      res.status(500).json({ errors: err.array });
      next(err);
    }

    return res.redirect('/profile');
  }];

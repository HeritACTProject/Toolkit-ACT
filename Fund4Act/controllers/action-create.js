const { param, body, validationResult } = require('express-validator');
const slug = require('slug');
const { nanoid } = require('nanoid');
const Action = require('../models/actions.js');
const { getAmbitionLevels }= require('../services/new-european-bauhaus.js');
const request = require('request-promise');

const locationSearch = async (query) => {
  const nominatimResponse = await request(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);
  const geocode = await JSON.parse(nominatimResponse)[0];
  if (!geocode.lat) throw Error();
  return [geocode.lat, geocode.lon];
}

exports.post = [
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
      res.render('action-info-form', {locationError: true});
      return;
    }

    try {
      data.slug = slug(`${data.name}-${nanoid(6)}`);
      data.lat = lat;
      data.lon = lon;
      await Action.create(data);
    } catch (err) {
      res.status(500).json({ errors: err.array });
      next(err);
    }

    res.redirect(`/action/${data.slug}/image-upload`)
  }];

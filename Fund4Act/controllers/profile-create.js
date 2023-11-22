const { param, body, validationResult } = require('express-validator');
const Profile = require('../models/profiles.js');

exports.post = [
  [
    body('name').trim().escape(),
  ], async (req, res, next) => {
    if (!req.body.name) return next();

    const user = req.user;
    const formData = {id: user.id, displayName: req.body.name};

    try {
      await Profile.saveProfileInfo(formData);
    } catch (e) {
      throw Error();
    }

    return next();
  }];

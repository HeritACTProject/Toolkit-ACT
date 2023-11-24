const { param, body, validationResult } = require('express-validator');
const Profile = require('../models/profiles.js');
const slug = require('slug');
const { nanoid } = require('nanoid');


exports.post = [
  [
    body('name').trim().escape(),
  ], async (req, res, next) => {
    if (!req.body.name) return next();

    const user = req.user;
    const data = {id: user.id, displayName: req.body.name};

    try {
      data.slug = slug(`${data.displayName}-${nanoid(6)}`);
      await Profile.saveProfileInfo(data);
    } catch (e) {
      throw Error();
    }

    return next();
  }];

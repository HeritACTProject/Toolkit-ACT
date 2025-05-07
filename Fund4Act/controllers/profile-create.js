const { param, body, validationResult } = require('express-validator');
const Profile = require('../models/profiles.js');
const slug = require('slug');
const { nanoid } = require('nanoid');


exports.post = [
  [
    body('name').trim().escape(),
    body('email').trim(),
  ], async (req, res, next) => {
    if (!req.body.name) return next();

    const user = req.user;
    const data = {id: user.id, displayName: req.body.name, email: req.body.email};
    console.log(data);

    try {
      data.slug = slug(`${data.displayName}-${nanoid(6)}`);
      await Profile.saveProfileInfo(data);
    } catch (e) {
      throw Error();
    }

    return next();
  }];

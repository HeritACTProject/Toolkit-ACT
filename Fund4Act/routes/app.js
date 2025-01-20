const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.js');
const Action = require('../models/actions.js');
const Profile = require('../models/profiles.js');

router.get('/', async (req, res, next) => {
  const data = await indexController.get(req, res, next);
  const actions = await Action.getAllCoordinatesAndSlugs();
  const profile = req.user ? await Profile.getProfileInfo(req.user.id) : null;
  res.render('index', {user: req.user, data, actions, profile});
});

module.exports = router;

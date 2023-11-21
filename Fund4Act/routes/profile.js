const express = require('express');
const router = express.Router();
const updateActionCreator = require('../controllers/action-creator-update.js')
const Profile = require('../models/profiles.js');
const Action = require('../models/actions.js');
const Pledge = require('../models/pledges.js');
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

const ensureLoggedIn = ensureLogIn();

router.route('/')
  .get(ensureLoggedIn, async (req, res) => {
    const user = req.user;
    const profile = await Profile.getProfileInfo(user.id);
    const actions = await Action.getByProfileId(user.id);
    res.render('profile', {user: user, profile, actions});
  });

router.route('/action-creator-prereq')
  .get(ensureLoggedIn, async (req, res) => {
    res.render('action-creator-prereq');
  })

router.route('/update-action-creator')
  .get(ensureLoggedIn, async (req, res) => {
    res.render('action-creator-form');
  })
  .post(
    ensureLoggedIn,
    updateActionCreator.post,
    async (req, res) => {
      res.redirect('/profile');
    }
  );

router.route('/verify')
  .get(ensureLoggedIn, async (req, res) => {
    res.render('action-creator-verify', {user: req.user})
  })
  .post(ensureLoggedIn, async (req, res) => {
    console.log(req.body);
  });

router.route('/edit')
  .get(ensureLoggedIn, async (req, res) => {
    res.send('Edit Profile Coming Soon');
  })

router.route('/:uid')
  .get(async (req, res) => {
    const profile = await Profile.get(req.params.uid);
    const actions = await Action.getByProfileId(req.params.uid);
    const pledges = await Pledge.getByDonorId(req.params.uid);
    res.render('public-profile', {user: req.user, profile, actions, pledges});
  })

module.exports = router;

const express = require('express');
const router = express.Router();
const updateActionCreator = require('../controllers/action-creator-update.js');
const createProfile = require('../controllers/profile-create.js');
const Profile = require('../models/profiles.js');
const Action = require('../models/actions.js');
const Pledge = require('../models/pledges.js');
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

const ensureLoggedIn = ensureLogIn();

router.route('/')
  .get(ensureLoggedIn, async (req, res) => {
    const user = req.user;
    const profile = await Profile.get(user.id);
    const actions = await Action.getByProfileId(user.id);
    res.render('profile', {user: user, profile, actions});
  })
  .post(
    ensureLoggedIn,
    createProfile.post,
    async (req, res) => {
      res.redirect('/profile');
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

router.route('/:slug')
  .get(async (req, res) => {
    try {
      const profile = await Profile.getBySlug(req.params.slug);
      const actions = await Action.getPublicByProfileId(profile.id);
      const pledges = await Pledge.getByDonorId(profile.id);
      res.render('public-profile', {user: req.user, profile, actions, pledges});
    } catch (err) {
      res.status(404);
      res.render('error', { layout: false, error: { message: 'Sorry we can\'t find that page' } });
    }
  })

module.exports = router;

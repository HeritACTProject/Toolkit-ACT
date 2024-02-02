const express = require('express');
const he = require('he');
const router = express.Router();
const { param, body, validationResult } = require('express-validator');
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
    var actions = await Action.getByProfileId(user.id);
    actions = actions.map((action)=>{
      action.name = he.decode(action.name);
      return action;
    })
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

      profile.constitution_url = encodeURIComponent(profile.constitution_url);
      profile.climate_action_plan_url = encodeURIComponent(profile.climate_action_plan_url);
      
      profile.display_name = he.decode(profile.display_name);
      profile.mission = he.decode(profile.mission);
      profile.previous_actions = he.decode(profile.previous_actions);
      profile.previous_grants = he.decode(profile.previous_grants);
      profile.partnerships = he.decode(profile.partnerships);

      res.render('public-profile', {user: req.user, profile, actions, pledges});
    } catch (err) {
      res.status(404);
      res.render('error', { layout: false, error: { message: 'Sorry we can\'t find that page' } });
    }
  })

module.exports = router;

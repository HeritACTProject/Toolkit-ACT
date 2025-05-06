const express = require('express');
const he = require('he');
const router = express.Router();
const { param, body, validationResult } = require('express-validator');
const updateActionCreator = require('../controllers/action-creator-update.js');
const { convertImage } = require('../controllers/image-upload.js');
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
    const user = req.user;
    const profile = await Profile.get(user.id);
    if (profile.website_url) profile.website_url = decodeURIComponent(profile.website_url);
    if (profile.constitution_url) profile.constitution_url = decodeURIComponent(profile.constitution_url);
    if (profile.climate_action_plan_url) profile.climate_action_plan_url = decodeURIComponent(profile.climate_action_plan_url);

    if (profile.display_name) profile.display_name = he.decode(profile?.display_name);
    if (profile.mission) profile.mission = he.decode(profile?.mission);
    if (profile.previous_actions) profile.previous_actions = he.decode(profile?.previous_actions);
    if (profile.previous_grants) profile.previous_grants = he.decode(profile?.previous_grants);
    if (profile.partnerships) profile.partnerships = he.decode(profile?.partnerships);

    res.render('action-creator-form', {user: req.user, profile});
  })
  .post(
    ensureLoggedIn,
    updateActionCreator.post,
    async (req, res) => {
      res.redirect('/profile');
    }
  );

router.route('/action-creator-image')
  .get(ensureLoggedIn, async (req, res) => {
    res.render('action-creator-image-form', {user: req.user});
  })
  .post(
    ensureLoggedIn,
    async (req,res, next) => {
      try {
        if (!req.body.image) {
          throw Error('500');
        }
        const convertedImage = await convertImage(req.user.id, 'profile_image', req.body['image'])
        await Profile.setLogoUrl(req.user.id);
        res.redirect(`/profile`);
      } catch (e) {
        next();
        return;
      }
    });

router.route('/verify')
  .get(ensureLoggedIn, async (req, res) => {
    res.render('action-creator-verify', {user: req.user})
  })

router.route('/edit')
  .get(ensureLoggedIn, async (req, res) => {
    res.send('Edit Profile Coming Soon');
  })

router.route('/:slug')
  .get(async (req, res) => {
    try {
      const profile = req.user ? await Profile.getProfileInfo(req.user.id) : null;
      const publicProfile = await Profile.getBySlug(req.params.slug);
      const actions = await Action.getPublicByProfileId(publicProfile.id);
      const pledges = await Pledge.getByDonorId(publicProfile.id);

      publicProfile.constitution_url = publicProfile.constitution_url;
      publicProfile.climate_action_plan_url = publicProfile.climate_action_plan_url;

      publicProfile.display_name = he.decode(publicProfile.display_name);
      publicProfile.mission = he.decode(publicProfile.mission);
      publicProfile.previous_actions = he.decode(publicProfile.previous_actions);
      publicProfile.previous_grants = he.decode(publicProfile.previous_grants);
      publicProfile.partnerships = he.decode(publicProfile.partnerships);


      res.render('public-profile', {user: req.user, profile, publicProfile, actions, pledges});
    } catch (err) {
      res.status(404);
      res.render('error', { layout: false, error: { message: 'Sorry we can\'t find that page' } });
    }
  })

module.exports = router;

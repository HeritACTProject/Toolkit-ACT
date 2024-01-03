const express = require('express');
const router = express.Router();
const createAction = require('../controllers/action-create.js');
const createPledge = require('../controllers/pledge-create.js');
const createProfile = require('../controllers/profile-create.js');
const updateAction = require('../controllers/action-update.js');
const { convertImage } = require('../controllers/image-upload.js');
const Action = require('../models/actions.js');
const Pledge = require('../models/pledges.js');
const Profile = require('../models/profiles')
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

const ensureLoggedIn = ensureLogIn();

router.route('/')
  .get(
    async (req, res) => {
      const { results, lastValue } = Action.getPage(0);
      const actions = results.slice(0, 9);

      const isLastPage = !results[10];

      res.render('action-browse.hbs', {user: req.user, actions, lastValue, isLastPage});
    })
  .post(
    async (req, res) => {
      const {results, lastValue} = Action.getPage(req.body.offset);
      const actions = results.slice(0, 9);

      const isLastPage = !results[10];

      res.render('action-browse.hbs', {user: req.user, actions, lastValue, isLastPage});
    });

router.route('/create')
  .get(
    ensureLoggedIn,
    async (req, res) => {
    res.render('action-create-form');
  })
  .post(
    ensureLoggedIn,
    createAction.post,
  );

router.route('/:slug')
  .get(async (req, res) => {
    const actionData = await Action.getByActionSlug(req.params.slug);
    actionData.beauty_ambition = actionData.beauty_ambition.toString().split('');
    actionData.sustain_ambition = actionData.sustain_ambition.toString().split('');
    actionData.together_ambition = actionData.together_ambition.toString().split('');
    actionData.participatory_process_ambition = actionData.participatory_process_ambition.toString().split('');
    actionData.multi_level_engagement_ambition = actionData.multi_level_engagement_ambition.toString().split('');
    actionData.transdiciplinary_ambition = actionData.transdiciplinary_ambition.toString().split('');
    actionData.pledges = await Pledge.getByActionSlugWithDonorInfo(req.params.slug);
    actionData.pledgeTotal = actionData.pledges.reduce((a, {amount}) => a + amount, 0);
    res.render('action', {user: req.user, actionData});
  });

router.route('/:slug/pledge')
  .get(ensureLoggedIn, async (req, res) => {
    const profile = await Profile.getProfileInfo(req.user.id);
    const action = await Action.getByActionSlug(req.params.slug);
    res.render('pledge-form', {user: req.user, profile, action});
  })
  .post(
    ensureLoggedIn,
    createProfile.post,
    createPledge.post,
    async (req, res, next) => {
      res.render('pledge-confirmation', {user: req.user, slug: req.params.slug})
    })

router.route('/:slug/image-upload')
  .get(
    ensureLoggedIn,
    async (req, res, next) => {
      res.render('image-upload', {user: req.user})
    })
  .post(
    ensureLoggedIn,
    async (req,res, next) => {
      try {
        if (!req.body.image) {
          throw Error('500');
        }
        const convertedImage = convertImage(req.user.id, req.params.slug, req.body['image'])
        res.redirect(`/${req.params.slug}/`);
      } catch (e) {
        next();
        return;
      }
    })

router.route('/:slug/edit')
  .get(ensureLoggedIn, async (req, res, next) => {
    try {
      const action = await Action.getByActionSlug(req.params.slug);

      if (!action) { throw Error('404'); }

      res.render('action-create-form', {user: req.user, action});
    } catch (e) {
      next();
      return;
    }
  })
  .post(
    ensureLoggedIn,
    updateAction.post,
  );

router.route('/:slug/delete')
  .get(ensureLoggedIn, async (req, res) => {
    res.send('Delete Project Coming Soon');
  })

module.exports = router;

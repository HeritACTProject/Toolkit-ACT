const express = require('express');
const router = express.Router();
const createAction = require('../controllers/action-create.js');
const createPledge = require('../controllers/pledge-create.js');
const Action = require('../models/actions.js');
const Pledge = require('../models/pledges.js');
const Profile = require('../models/profiles')
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

const ensureLoggedIn = ensureLogIn();

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
    actionData.pledges = await Pledge.getByActionSlugWithDonorInfo(req.params.slug);
    actionData.pledgeTotal = actionData.pledges.reduce((a, {amount}) => a + amount, 0);
    res.render('action', {user: req.user, actionData});
  });

router.route('/:slug/pledge')
  .get(ensureLoggedIn, async (req, res) => {
    const profile = await Profile.get(req.user.id);
    const action = await Action.getByActionSlug(req.params.slug);
    res.render('pledge-form', {user: req.user, profile, action});
  })
  .post(
    ensureLoggedIn,
    createPledge.post,
    async (req, res, next) => {
      res.render('pledge-confirmation', {slug: req.params.slug})
    })

router.route('/:slug/edit')
  .get(ensureLoggedIn, async (req, res) => {
    res.send('Edit Project Coming Soon');
  })

router.route('/:slug/delete')
  .get(ensureLoggedIn, async (req, res) => {
    res.send('Delete Project Coming Soon');
  })

module.exports = router;

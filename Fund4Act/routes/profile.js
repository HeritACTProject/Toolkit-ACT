const express = require('express');
const router = express.Router();
const updateProjectCreator = require('../controllers/project-creator-update.js')
const Profile = require('../models/profiles.js');
const Project = require('../models/projects.js');
const Pledge = require('../models/pledges.js');
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

const ensureLoggedIn = ensureLogIn();

router.route('/')
  .get(ensureLoggedIn, async (req, res) => {
    const user = req.user;
    const profile = await Profile.get(user.id);
    const projects = await Project.getByProfileId(user.id);
    res.render('profile', {user: user, profile, projects});
  });

router.route('/update-project-creator')
  .get(ensureLoggedIn, async (req, res) => {
    res.render('project-creator-form');
  })
  .post(
    ensureLoggedIn,
    updateProjectCreator.post,
    async (req, res) => {
      res.redirect('/profile');
    }
  );

router.route('/verify')
  .get(ensureLoggedIn, async (req, res) => {
    res.render('project-creator-verify', {user: req.user})
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
    const projects = await Project.getByProfileId(req.params.uid);
    const pledges = await Pledge.getByDonorId(req.params.uid);
    res.render('public-profile', {user: req.user, profile, projects, pledges});
  })

module.exports = router;

const express = require('express');
const router = express.Router();
const updateProjectCreator = require('../controllers/project-creator-update.js')
const Profile = require('../models/profiles.js');
const Project = require('../models/projects.js');
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
    updateProjectCreator.post,
    ensureLogIn,
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

router.route('/:uid')
  .get(async (req, res) => {
    res.render('org-public', {user: req.user});
  })

module.exports = router;

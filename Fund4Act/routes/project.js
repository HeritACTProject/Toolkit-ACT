const express = require('express');
const router = express.Router();
const createProject = require('../controllers/project-create.js');
const createPledge = require('../controllers/pledge-create.js');
const Project = require('../models/projects.js');
const Pledge = require('../models/pledges.js');
const Profile = require('../models/profiles')
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

const ensureLoggedIn = ensureLogIn();

router.route('/create')
  .get(
    ensureLoggedIn,
    async (req, res) => {
    res.render('project-create-form');
  })
  .post(
    ensureLoggedIn,
    createProject.post,
  );

router.route('/:slug')
  .get(async (req, res) => {
    const projectData = await Project.getByProjectSlug(req.params.slug);
    projectData.pledges = await Pledge.getByProjectSlugWithDonorInfo(req.params.slug);
    projectData.pledgeTotal = projectData.pledges.reduce((a, {amount}) => a + amount, 0);
    res.render('project', {user: req.user, projectData});
  });

router.route('/:slug/pledge')
  .get(ensureLoggedIn, async (req, res) => {
    const profile = await Profile.get(req.user.id);
    const project = await Project.getByProjectSlug(req.params.slug);
    res.render('pledge-form', {user: req.user, profile, project});
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

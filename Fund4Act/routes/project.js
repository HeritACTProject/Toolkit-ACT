const express = require('express');
const router = express.Router();
const createProject = require('../controllers/project-create.js');
const createPledge = require('../controllers/pledge-create.js');
const Project = require('../models/projects.js');
const Pledge = require('../models/pledges.js');
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
    async (req, res) => {
      res.redirect('/profile');
    }
  );

router.route('/:slug')
  .get(async (req, res, next) => {
    const projectData = Project.getByProjectSlug(req.params.slug);
    projectData.pledges = Pledge.getByProjectSlug(req.params.slug);
    projectData.pledgeTotal = projectData.pledges.reduce((a, {amount}) => a + amount, 0);
    res.render('project', {user: req.user, projectData});
  });

router.route('/:slug/pledge')
  .get(ensureLoggedIn, async (req, res) => {
    res.render('pledge-form', {user: req.user});
  })
  .post(
    ensureLoggedIn,
    createPledge.post,
    async (req, res, next) => {
      res.render('pledge-confirmation', {slug: req.params.slug})
    })

module.exports = router;

const express = require('express');
const router = express.Router();
const createOrganisation = require('../controllers/org-create.js')
const organisation = require('../models/organisations.js');
const project = require('../models/projects.js');

router.get('/', async (req, res) => {
  const user = req.user;
  const org = await organisation.get(user.id);
  const projects = await project.get(user.id);
  res.render('org', {user: user, org, projects});
});

router.route('/create')
  .get(async (req, res) => {
    res.render('org-create-form');
  })
  .post(
    createOrganisation.post,
    async (req, res) => {
      res.redirect('/organisation');
    }
  );

router.route('/verify')
  .get(async (req, res) => {
    res.render('org--verify-form')
  })
  .post(async (req, res) => {
    console.log(req.body);
  });

router.route('/:uid')
  .get(async (req, res) => {
    res.render('org-public', {user: req.user});
  })

module.exports = router;

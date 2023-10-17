const express = require('express');
const router = express.Router();
const createOrganisation = require('../controllers/org-create.js')
const organisation = require('../models/organisations.js');

router.get('/', async (req, res) => {
  console.log(await organisation.get());
  res.render('org', {});
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
    res.render('org-public');
  })

module.exports = router;

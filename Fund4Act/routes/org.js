const express = require('express');
const router = express.Router();
const organisation = require('../models/organisations.js')

router.get('/', async (req, res) => {
  // await organisation.save();
  console.log(await organisation.get());
  res.render('index', {user: req.user});
});

router.route('/register')
  .get(async (req, res) => {
    res.render('org-form')
  })
  .post(async (req, res) => {
    console.log(req.body);
  });

module.exports = router;

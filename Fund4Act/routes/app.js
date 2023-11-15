const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.js');
const Action = require('../models/actions.js');

router.get('/', async (req, res, next) => {
  const data = await indexController.get(req, res, next);
  const actions = await Action.getAllCoordinatesAndSlugs();
  res.render('index', {user: req.user, data, actions});
});

module.exports = router;

const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.js');

router.get('/', async (req, res, next) => {
  const data = await indexController.get(req, res, next);
  res.render('index', {user: req.user, data});
});

module.exports = router;

const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.js');
const Project = require('../models/projects.js');

router.get('/', async (req, res, next) => {
  const data = await indexController.get(req, res, next);
  const projects = await Project.getAllCoordinatesAndSlugs();
  res.render('index', {user: req.user, data, projects});
});

module.exports = router;

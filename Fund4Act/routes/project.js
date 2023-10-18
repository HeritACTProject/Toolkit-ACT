const express = require('express');
const router = express.Router();
// const createProject = require('../controllers/project-create.js')
// const project = require('../models/project.js');

router.route('/create')
  .get(async (req, res) => {
    res.render('project-create-form');
  })
  .post(
    // createOrganisation.post,
    async (req, res) => {
      res.redirect('/organisation');
    }
  );

router.route('/:pid')
  .get(async (req, res) => {
    // const project = project.get(req.param.pid);
    res.render('project-public', {user: req.user, project});
  })

module.exports = router;

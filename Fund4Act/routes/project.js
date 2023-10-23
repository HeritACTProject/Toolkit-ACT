const express = require('express');
const router = express.Router();
const createProject = require('../controllers/project-create.js')

router.route('/create')
  .get(async (req, res) => {
    res.render('project-create-form');
  })
  .post(
    createProject.post,
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

const express = require('express');
const csrf = require('csurf');

const router = express.Router({ mergeParams: true });

// set up route middleware
const csrfProtection = csrf({ cookie: true });

const assessmentInfoController = require('../controllers/assessmentInfoController');
const tagsController = require('../controllers/tagsController');
const targetsController = require('../controllers/targetsController');
const assessmentProfileController = require('../controllers/assessmentProfileController');

router.route('/')
  .get((req, res) => res.redirect('/app/info'));

router.route('/info')
  .get(csrfProtection, assessmentInfoController.get)
  .post(assessmentInfoController.post);

router.route('/:assessment/tags')
  .get(csrfProtection, tagsController.get)
  .post(tagsController.post);

router.route('/:assessment/targets')
  .get(csrfProtection, targetsController.get)
  .post(targetsController.post);

router.route('/:assessment')
  .get(assessmentProfileController.get);

module.exports = router;

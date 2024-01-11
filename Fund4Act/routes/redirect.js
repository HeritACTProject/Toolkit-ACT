const express = require('express');
const router = express.Router();
const escapedUrlRedirectController = require('../controllers/escapedUrlRedirect.js');

router.route('/:url')
  .get(
    escapedUrlRedirectController.get,
  );

module.exports = router;

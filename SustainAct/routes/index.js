const express = require('express');
const csrf = require('csurf');

const router = express.Router();

// set up route middleware
const csrfProtection = csrf({ cookie: true });

/* GET home page. */
router.get('/', async (req, res) => {
  res.redirect('/app/');
});

module.exports = router;

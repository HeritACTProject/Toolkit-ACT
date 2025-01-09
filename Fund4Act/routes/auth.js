const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

const ensureLoggedIn = ensureLogIn();

router.route('/simplelogin')
  .get(
    async (req, res, next) => {
      passport.authenticate('SimpleLogin');
    });

router.route('/google')
  .get(
    async (req, res, next) => {
      try {
        passport.authenticate('google', { scope:[ 'email', 'profile' ] });
      } catch (err) {
        next(err);
      }
    });

module.exports = router;

const express = require('express');
const router = express.Router();
const Profile = require('../models/profiles')
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

const ensureLoggedIn = ensureLogIn();

router.route('/')
  .get(
    ensureLoggedIn,
    async (req, res, next) => {
      try {
        const user = req.user;
        if (user.id !== process.env.ADMIN_ID) throw Error();
        res.render('admin-project-creator-verify', { user });
      } catch (err) {
        err.status = 404;
        next(err);
      }
    })
  .post(
    ensureLoggedIn,
    async (req, res, next) => {
      try {
        const user = req.user;
        if (user.id !== process.env.ADMIN_ID) throw Error();
        await Profile.updateVerifiedById(req.body['ticket-id']);
        res.render('admin-project-creator-verify', { user, statusMsg: "Creator verified success" });
      } catch (err) {
        err.status = 500;
        next(err);
      }
    });

module.exports = router;

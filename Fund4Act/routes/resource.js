const express = require('express');
const router = express.Router();

router.get('/constitution', async (req, res, next) => {
  res.render('constitution-resource', {user: req.user});
});

router.get('/bank-account', async (req, res, next) => {
    res.render('bank-account-resource', {user: req.user});
});

router.get('/organisation-mission', async (req, res, next) => {
    res.render('organisation-mission-resource', {user: req.user});
});

router.get('/climate-action-plan', async (req, res, next) => {
    res.render('organisation-mission-resource', {user: req.user});
});

router.get('/action-categories', async (req, res, next) => {
    res.render('action-categories-resource', {user: req.user});
});

module.exports = router;

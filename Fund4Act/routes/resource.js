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

router.get('/action-categories/community-engagement', async (req, res, next) => {
    res.render('community-engagement-resource', {user: req.user});
});
router.get('/action-categories/cultural-celebrations', async (req, res, next) => {
    res.render('cultural-celebrations-resource', {user: req.user});
});
router.get('/action-categories/ecosystem-conservation', async (req, res, next) => {
    res.render('ecosystem-conservation-resource', {user: req.user});
});
router.get('/action-categories/education-and-awareness', async (req, res, next) => {
    res.render('education-and-awareness-resource', {user: req.user});
});
router.get('/action-categories/environmental-education', async (req, res, next) => {
    res.render('environmental-education-resource', {user: req.user});
});
router.get('/action-categories/green-spaces-and-biodiversity', async (req, res, next) => {
    res.render('green-spaces-and-biodiversity-resource', {user: req.user});
});
router.get('/action-categories/historic-building-preservation', async (req, res, next) => {
    res.render('historic-building-preservation-resource', {user: req.user});
});
router.get('/action-categories/language-and-tradition', async (req, res, next) => {
    res.render('language-and-tradition-resource', {user: req.user});
});
router.get('/action-categories/storytelling-and-documentation', async (req, res, next) => {
    res.render('storytelling-and-documentation-resource', {user: req.user});
});
router.get('/action-categories/traditional-cuisine-initiatives', async (req, res, next) => {
    res.render('traditional-cuisine-initiatives-resource', {user: req.user});
});

router.get('/terms-and-conditions/action-create', async (req, res, next) => {
    res.render('action-create-terms-and-conditions', {user: req.user});
});

router.get('/terms-and-conditions/action-creator-profile', async (req, res, next) => {
    res.render('action-creator-profile-terms-and-conditions', {user: req.user});
});

router.get('/terms-and-conditions/profile', async (req, res, next) => {
    res.render('profile-terms-and-conditions', {user: req.user});
});

router.get('/privacy-policy', async (req, res, next) => {
    res.render('privacy-policy', {user: req.user});
});

router.get('/upload-to-google-drive', async (req, res, next) => {
    res.render('upload-to-google-drive-resource', {user: req.user});
});

module.exports = router;

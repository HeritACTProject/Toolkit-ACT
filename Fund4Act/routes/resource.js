const express = require('express');
const router = express.Router();

const profileImage = (req) => req.user?.id ? `/images/upload/${req.user.id}/profile_image.webp?v=${Date.now()}` : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDc0NzQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaXJjbGUtdXNlci1yb3VuZC1pY29uIGx1Y2lkZS1jaXJjbGUtdXNlci1yb3VuZCI+PHBhdGggZD0iTTE4IDIwYTYgNiAwIDAgMC0xMiAwIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iNCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PC9zdmc+';

router.get('/constitution', async (req, res, next) => {
  res.render('constitution-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});

router.get('/bank-account', async (req, res, next) => {
  res.render('bank-account-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});

router.get('/organisation-mission', async (req, res, next) => {
  res.render('organisation-mission-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});

router.get('/climate-action-plan', async (req, res, next) => {
  res.render('organisation-mission-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});

router.get('/relevant-links', async (req, res, next) => {
  res.render('relevant-links-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});

router.get('/action-categories', async (req, res, next) => {
  res.render('action-categories-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});

router.get('/action-categories/community-engagement', async (req, res, next) => {
  res.render('community-engagement-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});
router.get('/action-categories/cultural-celebrations', async (req, res, next) => {
  res.render('cultural-celebrations-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});
router.get('/action-categories/ecosystem-conservation', async (req, res, next) => {
  res.render('ecosystem-conservation-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});
router.get('/action-categories/education-and-awareness', async (req, res, next) => {
  res.render('education-and-awareness-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});
router.get('/action-categories/environmental-education', async (req, res, next) => {
  res.render('environmental-education-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});
router.get('/action-categories/green-spaces-and-biodiversity', async (req, res, next) => {
  res.render('green-spaces-and-biodiversity-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});
router.get('/action-categories/historic-building-preservation', async (req, res, next) => {
  res.render('historic-building-preservation-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});
router.get('/action-categories/language-and-tradition', async (req, res, next) => {
  res.render('language-and-tradition-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});
router.get('/action-categories/storytelling-and-documentation', async (req, res, next) => {
  res.render('storytelling-and-documentation-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});
router.get('/action-categories/traditional-cuisine-initiatives', async (req, res, next) => {
  res.render('traditional-cuisine-initiatives-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});

router.get('/terms-and-conditions/action-create', async (req, res, next) => {
  res.render('action-create-terms-and-conditions', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});

router.get('/terms-and-conditions/action-creator-profile', async (req, res, next) => {
  res.render('action-creator-profile-terms-and-conditions', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});

router.get('/terms-and-conditions/profile', async (req, res, next) => {
  res.render('profile-terms-and-conditions', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});

router.get('/privacy-policy', async (req, res, next) => {
  res.render('privacy-policy', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});

router.get('/upload-to-google-drive', async (req, res, next) => {
  res.render('upload-to-google-drive-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});

router.get('/about-this-site', async (req, res, next) => {
  res.render('about-this-site-resource', {
    profile: {logo_url: profileImage(req)},
    user: req.user});
});

module.exports = router;

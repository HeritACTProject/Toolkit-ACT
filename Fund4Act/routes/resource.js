const express = require('express');
const router = express.Router();

const profileImage = (req) => req.user?.id ? `/images/upload/${req.user.id}/profile_image.webp` : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATdSURBVHgB1ZpNTBxlGMf/7ywNmECy0MQu68GtTWgTlQ4Bo2DU4SCeEDwpTUzpQeqNj/XiieXSeODzWC6CB/FIoYf6kbhGY02UOMR6kETdegCqCWAg0TSw0+d52V12YWd35p1ZdvtLNjsfz7Dvn/fj+XhHwCf0oUsRaGcMaOIyIAxYCNLl9CdNQn6EZSJprSIZiJvTZgI+IOABfUgPQksOQoh+Oo1ADRa2iH1txosoJSH60HMGAoFROjTgL3M4EGMqglwJoR6IIGBN0WEvSotrQQGnhnq0eRAaPuNDlB6dfqs31P7kv5t3/zadPOBIiD7SPEXzIEaHNTg9gvSbvaGXzwU3v3/weTHjgkNLTuYq62tagU6jF+wRMLEvOmmo7dib2OBVRGN9I9outGXOd//bxcrvK9j9fxdKFBFTZfugoojWZ1ox0HUdrRda895fW1/DxK1xrPyxAldwW7hNQEu+23nniJwTEK5XJhYQezuGcEPY1uZs3Vl0v9BNPbSHe3/9ApeE7ObMCSH6yPP9ENpHcEl3Wzeib0Yd23dc6pBDbWN7A+4QL4Xaz9Fq9uCH7Kta9on0E0IbhQLcG6fxjESIUdnWLHKEkLNjERG4xCBHz5PbLTyPmsJNUCCYcswZMkJSCvuhgIqINOGGp6BIL7XZSJ8c9chhbyhRV1MHVWpraqFMVpulEC+9UWYM6e+Q7hGRHMLjinbY9kMhmuhBmdjYWocnhLjKX1pqWEXgAeWwwx8iLdGWpzVoBwY8skdeupxY1n6nBkuUN7L1AyF07bBY4A0ONVTgiHhtYw3eEa/xZI/AI+vb60pi4r/GpRgfCPoihFn47lO45faPy/CJoAafkEmTi/8uL7uucxJ7/BPCIiaXJhzbz345Cz9hITvwieWflmUGWIy19d+krZ/4KoSZWBoveJ97LjrnPAFzSEKjpN43IRzON4UvFsz69kgIFyUU8xA7EkIfbp4mXzIIRTiE73vliszD3eYlPAzj9+I0zJYUUt5srBmRytE/hkvC9WG81zUgc3U/4Dkz+8VNNUGWuCZS9dw/nT6T7oEBElEKlAQdiPOyQKdHL7OQSCHbtIC+V/s8ZYRO4AVh4dsF6WSL+iYLCXNy9bwsB1GtqF5uztgw8Pp13Hj3BjoudqC6qhqlpvpMtSxMvKF38bDB/X8SeLj/ML+xsOapNHTnsEc4XQxY28dtuGoYe2fMU3HBDzYoluMlO6+PomHF2w+Z2i8NLy5HGulz41kD4/3OPfVpcGWq77iYOXNi9RofHIUoQoxlW0R7PkClcfP9Y2HNwVGbM0LMcTNOX4vp83IPp3zUPZGzyMxl72jlBo0HYhg+hywlgVaq7N5gcoRIhVauQWVycn/xRBhvTprT7PJRsYgZauPciat25lO3J3/e2t2qqMJEQ22DOdw9knejx3bHav6rTzrJt/CSXCliTJoXnXY3i2+GVoYYKUJpMzQb2mOneaMe6nuD5sSEWbQ27WifnWOZUHvjfXDPiJyXZErJDjnpD0lEzImx4zcfNu9umqEXG29BszjALPVQW6Sh9BatTnecPqD4Ug3nMMkYPX4V/hLnUCkVZbjC62tOLGiInGgP/aUI1EhQ4+exj+lCk7kYnoRkI0VpFD2LJA07WU+OIDdZ2zn6WN/A0kwk4duLZ48AwZW9nCitJWkAAAAASUVORK5CYII=';

router.get('/constitution', async (req, res, next) => {
  res.render('constitution-resource', {
    profile: {logo_url: profilemage},
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

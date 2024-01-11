const { param, body, validationResult } = require('express-validator');

exports.get = [
  [
    param('url').trim().notEmpty().unescape(),
  ], async (req, res, next) => {
    res.redirect(req.params.url);
  }];

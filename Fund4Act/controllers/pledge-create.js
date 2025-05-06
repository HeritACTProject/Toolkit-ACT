const { param, body, validationResult } = require('express-validator');
const { sendMail } = require('../tools/email-service');
const pledge = require('../models/pledges');
const profile = require('../models/profiles');
const action = require('../models/actions');

exports.post = [
  [
    body('amount').notEmpty().isNumeric(),
    body('comment'),
  ], async (req, res, next) => {
    const data = {
      proj_slug: req.params.slug,
      donor_id: req.user.id,
      amount: req.body.amount,
      comment: req.body.comment,
    };

    try {
      validationResult(req.params, req.body).throw();
    } catch (err) {
      res.status(400).json({ errors: err.array });
      next(err);
    }
    try {
      await pledge.create(data);
      const actionInfo = await action.getByActionWithOwnerInfo(data.proj_slug)[0];
      const donorInfo = await profile.getProfileInfo(req.user.id);
      const subject = `${actionInfo.name} has recieved a new pledge`;
      const text = `A new pledge of €${data.amount} was recieved from ${donorInfo.display_name}. `
        + `Contact ${donorInfo.email} to arrange payment.`;
      let html = `<p>A new pledge of €${data.amount} was recieved from ${donorInfo.display_name}.`;
      if (data.comment) html += `<p>They said: "${data.comment}"`;
      html += `<p>Contact ${donorInfo.email} to arrange payment.`;
      sendMail(actionInfo.owner_email, 'pledges@fund4act.com', subject, text, html);
    } catch (err) {
      res.status(500).json({ errors: err.array });
      next(err);
    }

    return next();
  }];

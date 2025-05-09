const express = require('express');
const router = express.Router();
const createAction = require('../controllers/action-create.js');
const deleteAction = require('../controllers/action-delete.js');
const createPledge = require('../controllers/pledge-create.js');
const createProfile = require('../controllers/profile-create.js');
const updateAction = require('../controllers/action-update.js');
const { convertImage } = require('../controllers/image-upload.js');
const { deleteImage } = require('../controllers/image-delete.js');
const Action = require('../models/actions.js');
const Pledge = require('../models/pledges.js');
const Profile = require('../models/profiles.js')
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const he = require('he');

const ensureLoggedIn = ensureLogIn();

const transformAmbitions = async (actionData) => {
  actionData.beauty_ambition = actionData.beautyAmbition.split('').map((x) => +x);
  actionData.sustain_ambition = actionData.sustainAmbition.split('').map((x) => +x);
  actionData.together_ambition = actionData.togetherAmbition.split('').map((x) => +x);
  actionData.participatory_process_ambition = actionData.participProcessAmbition.split('').map((x) => +x);
  actionData.multi_level_engagement_ambition = actionData.multiLevelEngagementAmbition.split('').map((x) => +x);
  actionData.transdiciplinary_ambition = actionData.transdiciplinaryAmbition.split('').map((x) => +x);
  return actionData;
}

const transformCateory = async (category) => {
  return category.split(",");
}

const hasCompassData = async (actionData) => {
  return actionData.beautyAmbition !== "000"
    || actionData.sustainAmbition !== "000"
    || actionData.togetherAmbition !== "000"
    || actionData.participProcessAmbition !== "000"
    || actionData.multiLevelEngagementAmbition !== "000"
    || actionData.transdiciplinaryAmbition !== "000";
}

const profileImage = (req) => req.user?.id ? `/images/upload/${req.user.id}/profile_image.webp` : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATdSURBVHgB1ZpNTBxlGMf/7ywNmECy0MQu68GtTWgTlQ4Bo2DU4SCeEDwpTUzpQeqNj/XiieXSeODzWC6CB/FIoYf6kbhGY02UOMR6kETdegCqCWAg0TSw0+d52V12YWd35p1ZdvtLNjsfz7Dvn/fj+XhHwCf0oUsRaGcMaOIyIAxYCNLl9CdNQn6EZSJprSIZiJvTZgI+IOABfUgPQksOQoh+Oo1ADRa2iH1txosoJSH60HMGAoFROjTgL3M4EGMqglwJoR6IIGBN0WEvSotrQQGnhnq0eRAaPuNDlB6dfqs31P7kv5t3/zadPOBIiD7SPEXzIEaHNTg9gvSbvaGXzwU3v3/weTHjgkNLTuYq62tagU6jF+wRMLEvOmmo7dib2OBVRGN9I9outGXOd//bxcrvK9j9fxdKFBFTZfugoojWZ1ox0HUdrRda895fW1/DxK1xrPyxAldwW7hNQEu+23nniJwTEK5XJhYQezuGcEPY1uZs3Vl0v9BNPbSHe3/9ApeE7ObMCSH6yPP9ENpHcEl3Wzeib0Yd23dc6pBDbWN7A+4QL4Xaz9Fq9uCH7Kta9on0E0IbhQLcG6fxjESIUdnWLHKEkLNjERG4xCBHz5PbLTyPmsJNUCCYcswZMkJSCvuhgIqINOGGp6BIL7XZSJ8c9chhbyhRV1MHVWpraqFMVpulEC+9UWYM6e+Q7hGRHMLjinbY9kMhmuhBmdjYWocnhLjKX1pqWEXgAeWwwx8iLdGWpzVoBwY8skdeupxY1n6nBkuUN7L1AyF07bBY4A0ONVTgiHhtYw3eEa/xZI/AI+vb60pi4r/GpRgfCPoihFn47lO45faPy/CJoAafkEmTi/8uL7uucxJ7/BPCIiaXJhzbz345Cz9hITvwieWflmUGWIy19d+krZ/4KoSZWBoveJ97LjrnPAFzSEKjpN43IRzON4UvFsz69kgIFyUU8xA7EkIfbp4mXzIIRTiE73vliszD3eYlPAzj9+I0zJYUUt5srBmRytE/hkvC9WG81zUgc3U/4Dkz+8VNNUGWuCZS9dw/nT6T7oEBElEKlAQdiPOyQKdHL7OQSCHbtIC+V/s8ZYRO4AVh4dsF6WSL+iYLCXNy9bwsB1GtqF5uztgw8Pp13Hj3BjoudqC6qhqlpvpMtSxMvKF38bDB/X8SeLj/ML+xsOapNHTnsEc4XQxY28dtuGoYe2fMU3HBDzYoluMlO6+PomHF2w+Z2i8NLy5HGulz41kD4/3OPfVpcGWq77iYOXNi9RofHIUoQoxlW0R7PkClcfP9Y2HNwVGbM0LMcTNOX4vp83IPp3zUPZGzyMxl72jlBo0HYhg+hywlgVaq7N5gcoRIhVauQWVycn/xRBhvTprT7PJRsYgZauPciat25lO3J3/e2t2qqMJEQ22DOdw9knejx3bHav6rTzrJt/CSXCliTJoXnXY3i2+GVoYYKUJpMzQb2mOneaMe6nuD5sSEWbQ27WifnWOZUHvjfXDPiJyXZErJDjnpD0lEzImx4zcfNu9umqEXG29BszjALPVQW6Sh9BatTnecPqD4Ug3nMMkYPX4V/hLnUCkVZbjC62tOLGiInGgP/aUI1EhQ4+exj+lCk7kYnoRkI0VpFD2LJA07WU+OIDdZ2zn6WN/A0kwk4duLZ48AwZW9nCitJWkAAAAASUVORK5CYII=';

router.route('/')
  .get(
    async (req, res) => {
      const { results, lastValue } = Action.getPage(0);
      let actions = results.slice(0, 9);
      actions = await Promise.all(actions.map(async (action)=>{
        const pledges = await Pledge.getByActionSlug(action.slug);
        action.total_pledged = pledges.reduce((a, {amount}) => a + amount, 0);
        const profile = await Profile.getProfileInfo(action.profile_id);
        action.profile_name = profile.display_name;
        return action;
      }));

      const isLastPage = !results[10];

      res.render('action-browse.hbs', {
        profile: {logo_url: profileImage(req)},
        user: req.user,
        actions,
        lastValue,
        isLastPage
      });
    })
  .post(
    async (req, res) => {
      const {results, lastValue} = Action.getPage(req.body.offset);
      let actions = results.slice(0, 9);
      actions = await Promise.all(actions.map(async (action)=>{
        const pledges = await Pledge.getByActionSlug(action.slug);
        action.total_pledged = pledges.reduce((a, {amount}) => a + amount, 0)
        const profile = await Profile.getProfileInfo(action.profile_id);
        action.profile_name = profile.display_name;
        return action;
      }));

      const isLastPage = !results[10];

      res.render('action-browse.hbs', {
        profile: {logo_url: profileImage(req)},
        user: req.user,
        actions,
        lastValue,
        isLastPage
      });
    });

router.route('/create')
  .get(
    ensureLoggedIn,
    async (req, res) => {
    res.render('action-info-form', {
      profile: {logo_url: profileImage(req)},
      user: req.user
    });
  })
  .post(
    ensureLoggedIn,
    createAction.post,
  );

router.route('/:slug')
  .get(async (req, res, next) => {
    try {
      const profile = req.user ? await Profile.getProfileInfo(req.user.id) : null;
      let actionData = await Action.getByActionSlug(req.params.slug);

      if (!actionData) { throw Error('404'); }

      const actionOwnerProfile = await Profile.getProfileInfo(actionData.profile_id);
      actionData.profileImageUrl = actionOwnerProfile.logo_url;
      actionData.display_name = he.decode(actionOwnerProfile.display_name);
      actionData.profile_slug = actionOwnerProfile.slug;
      actionData.name = he.decode(actionData.name);
      actionData.overview = he.decode(actionData.overview);
      actionData = await transformAmbitions(actionData);
      actionData.category = await transformCateory(actionData.category);
      actionData.pledges = await Pledge.getByActionSlugWithDonorInfo(req.params.slug);
      actionData.pledgeTotal = await actionData.pledges.reduce((a, {amount}) => a + amount, 0);
      actionData.hasCompassData = await hasCompassData(actionData);
      res.render('action', {
        user: req.user,
        actionData,
        profile,
        timestamp: Date.now(),
        emptyAmbition: [0,0,0]});
    } catch (e) {
      next();
      return;
    }
  });

  router.route('/:slug/pledges')
  .get(
    async (req, res, next) => {
      try {
        const profile = req.user ? await Profile.getProfileInfo(req.user.id) : null;;
        const { results, lastValue } = Pledge.getPageForAction(0, req.params.slug);
        const pledges = results.slice(0, 9);
        const action = await Action.getByActionSlug(req.params.slug);

        if (!action) { throw Error('404'); }

        const isActionOwner = action.profile_id === req.user?.id;
        const isLastPage = !results[10];

        res.render('pledge-browse.hbs', {
          user: req.user,
          profile,
          pledges,
          action,
          lastValue,
          isLastPage,
          isActionOwner
        });
    } catch (e) {
      next();
      return;
    }
    })
  .post(
    async (req, res) => {
      const {results, lastValue} = Pledge.getPageForAction(req.body.offset, req.params.slug);
      const pledges = results.slice(0, 9);
      const action = await Action.getByActionSlug(req.params.slug);

      const isLastPage = !results[10];

      res.render('pledge-browse.hbs', {
        profile: {logo_url: profileImage(req)},
        user: req.user,
        pledges, action,
        lastValue,
        isLastPage
      });
    });

router.route('/:slug/pledge')
  .get(ensureLoggedIn, async (req, res, next) => {
    try {
      const profile = await Profile.getProfileInfo(req.user.id);
      const action = await Action.getByActionSlug(req.params.slug);

      if (!action) { throw Error('404'); }
      if (action.deleted) {
        res.redirect(`/action/${req.params.slug}`);
        return;
      }

      res.render('pledge-form', {
        user: req.user, profile,
        action
      });
    } catch (e) {
      next();
      return;
    }
  })
  .post(
    ensureLoggedIn,
    createProfile.post,
    createPledge.post,
    async (req, res, next) => {
      const action = await Action.getByActionSlug(req.params.slug);
      const donorInfo = await Profile.getProfileInfo(req.user.id);

      if (action.deleted) {
        res.redirect(`/action/${req.params.slug}`);
        return;
      }

      res.render('pledge-confirmation', {
        profile: {logo_url: profileImage(req)},
        user: req.user,
        slug: req.params.slug,
        donorEmail: donorInfo.email
      });
    })

router.route('/:slug/pledge/:pledge_id/received')
  .get(
    async (req, res, next) => {
      res.redirect(`/action/${req.params.slug}/pledges`)
    }
  )
  .post(
    ensureLoggedIn,
    async (req, res, next) => {
      const action = await Action.getByActionSlug(req.params.slug);

      if (action.profile_id !== req.user.id) return;

      await Pledge.markReceived(req.params.pledge_id);

      res.redirect(`/action/${req.params.slug}/pledges`)
    });

router.route('/:slug/pledge/:pledge_id/notreceived')
  .get(
    async (req, res, next) => {
      res.redirect(`/action/${req.params.slug}/pledges`, {
        profile: {logo_url: profileImage(req)},
        user: req.user,
      });
    }
  )
  .post(
    ensureLoggedIn,
    async (req, res, next) => {
      const action = await Action.getByActionSlug(req.params.slug);

      if (action.profile_id !== req.user.id) return;

      await Pledge.markNotReceived(req.params.pledge_id);

      res.redirect(`/action/${req.params.slug}/pledges`);
    });

router.route('/:slug/pledge/:pledge_id/delete')
  .get(ensureLoggedIn, async (req, res) => {
    const actionSlug = req.params.slug;
    res.render('delete-pledge', {
      profile: {logo_url: profileImage(req)},
      user: req.user,
      actionSlug
    });
  })
  .post(ensureLoggedIn, async (req, res) => {
    await Pledge.delete(req.params.pledge_id);
    res.redirect(`/action/${req.params.slug}/pledges`);
  });

router.route('/:slug/image-upload')
  .get(
    ensureLoggedIn,
    async (req, res, next) => {
      res.render('image-upload', {
        profile: {logo_url: profileImage(req)},
        user: req.user,
        action: {slug: req.params.slug}});
    })
  .post(
    ensureLoggedIn,
    async (req,res, next) => {
      try {
        if (!req.body.image) {
          throw Error('500');
        }
        const convertedImage = await convertImage(req.user.id, req.params.slug, req.body['image'])
        res.redirect(`/action/${req.params.slug}/edit/impact`);
      } catch (e) {
        next();
        return;
      }
    })

router.route('/:slug/edit')
  .get(ensureLoggedIn, async (req, res, next) => {
    res.redirect(`/action/${req.params.slug}/edit/info`)
  })

router.route('/:slug/edit/info')
  .get(ensureLoggedIn, async (req, res, next) => {
    try {
      const action = await Action.getByActionSlug(req.params.slug);

      if (!action) { throw Error('404'); }

      action.name = he.decode(action.name);
      action.overview = he.decode(action.overview);

      action.category = action.category.split(',');
      action.category = action.category.reduce((acc,curr)=> (acc[curr.toLowerCase().replace(/\s+/g, '_')]=true,acc),{});

      res.render('action-info-form', {
        profile: {logo_url: profileImage(req)},
        user: req.user,
        action
      });
    } catch (e) {
      next();
      return;
    }
  })
  .post(
    ensureLoggedIn,
    updateAction.updateInfoBySlug,
  );

router.route('/:slug/edit/impact')
  .get(ensureLoggedIn, async (req, res, next) => {
    try {
      let actionData = await Action.getByActionSlug(req.params.slug);

      if (!actionData) { throw Error('404'); }

      actionData = await transformAmbitions(actionData);

      res.render('action-impact-form', {
        profile: {logo_url: profileImage(req)},
        user: req.user,
        actionData
      });
    } catch (e) {
      next();
      return;
    }
  })
  .post(
    ensureLoggedIn,
    updateAction.updateAmbitionsBySlug,
  );

router.route('/:slug/edit/funding')
  .get(ensureLoggedIn, async (req, res, next) => {
    try {
      const action = await Action.getByActionSlug(req.params.slug);

      if (!action) { throw Error('404'); }

      action.category = action.category.split(',');
      action.category = action.category.reduce((acc,curr)=> (acc[curr.toLowerCase().replace(/\s+/g, '_')]=true,acc),{});
      action.hasNoCategories = Object.keys(action.category)[0] === "";


      res.render('action-funding-form', {
        profile: {logo_url: profileImage(req)},
        user: req.user,
        action
      });
    } catch (e) {
      next();
      return;
    }
  })
  .post(
    ensureLoggedIn,
    updateAction.updateFundingBySlug,
  );

router.route('/:slug/delete')
  .get(ensureLoggedIn, async (req, res) => {
    res.render('delete-action');
  })
  .post(ensureLoggedIn, async (req, res) => {
    await deleteAction.deleteActionBySlug(req.params.slug, req.user.id);
    await deleteImage(req.user.id, req.params.slug);
    res.redirect('/profile');
  });

module.exports = router;

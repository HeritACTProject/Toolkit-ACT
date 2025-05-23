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

const profileImage = (req) => req.user?.id ? `/images/upload/${req.user.id}/profile_image.webp?v=${Date.now()}` : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDc0NzQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaXJjbGUtdXNlci1yb3VuZC1pY29uIGx1Y2lkZS1jaXJjbGUtdXNlci1yb3VuZCI+PHBhdGggZD0iTTE4IDIwYTYgNiAwIDAgMC0xMiAwIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iNCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PC9zdmc+';

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
        action: {slug: req.params.slug},
        timestamp: Date.now(),
      });
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

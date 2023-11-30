/* eslint-disable import/no-unresolved */
const { getAuth } = require('firebase-admin/auth');
const { getSubscriptionStatus } = require('../tools/stripe-service');
const { getCustomerWorkspaces } = require('../tools/firebase-service');
const { getOrganisationObjects, getOrganisationOwner } = require('../services/organisationService');
const { hasWorkspacePermission } = require('../tools/firebase-service');

exports.createSessionCookie = async (req, res, next) => {
  const { idToken } = req.query;
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  await getAuth().verifyIdToken(idToken).then((decodedClaims) => {
    req.decodedClaims = decodedClaims;
  });

  const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
  // Set cookie policy for session cookie and set in response.
  const options = {
    maxAge: expiresIn,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    SameSite: 'None',
  };

  res.cookie('__session', sessionCookie, options);
  next();
};

exports.authenticateToken = (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  const sessionCookie = req.cookies.__session || '';

  getAuth().verifySessionCookie(sessionCookie, true).then((decodedClaims) => {
    req.decodedClaims = decodedClaims;
    next();
  }).catch(() => {
    // Session cookie is unavailable or invalid. Force user to login.
    res.redirect('/signin');
  });
};

exports.addSubscriptionToReq = async (req, res, next) => {
  // check subscription status
  // handle multiworkspace owner
  let { ownerId } = await getOrganisationOwner(req.params.organisation);
  ownerId = ownerId || req.params.organisation;

  // pricing page
  if (!req.params.organisation) ownerId = req.decodedClaims.uid;
  if (!ownerId) res.redirect('signin');

  const subscriptionStatus = await getSubscriptionStatus(ownerId);
  req.decodedClaims.subStatus = subscriptionStatus;

  getAuth()
    // get latest claims
    .getUser(ownerId)
    .then(({ customClaims }) => {
      if (customClaims && customClaims.stripeRole) {
        req.decodedClaims.stripeRole = customClaims.stripeRole;
        req.decodedClaims.trialEnd = customClaims.trialEnd;
        if (customClaims.stripeRole === 'demo') {
          req.decodedClaims.demoCount = customClaims.demoCount;
        }
      }

      if (req.decodedClaims.stripeRole === 'enterprise' && req.decodedClaims.uid !== ownerId) {
        // TODO: change to team
        req.decodedClaims.stripeRole = 'bespoke';
      }
      next();
    })
    .catch(() => {
      // Session cookie is unavailable or invalid. Force user to login.
      res.redirect('/signin');
    });
};

exports.authenticateSubscription = async (req, res, next) => {
  // check subscription status
  const orgId = req.params.organisation || req.decodedClaims.uid;
  const { ownerId } = await getOrganisationOwner(req.params.organisation);

  const subscriptionStatus = await getSubscriptionStatus(ownerId || orgId);
  if (subscriptionStatus === 'past_due') {
    res.redirect(307, '/user/stripe-portal');
  } if (!req.decodedClaims.stripeRole) {
    res.redirect('/pricing');
  } else next();
};

exports.addWorkspacePermissionToReq = async (req, res, next) => {
  const { uid } = req.decodedClaims;
  const orgId = req.params.organisation;

  let workspaces = await getCustomerWorkspaces(req.decodedClaims.uid);
  const workspaceIds = workspaces.map((workspace) => workspace.id);

  if (workspaces) {
    // add own workspace to list
    workspaces.unshift({ id: uid, permission: { level: 'owner', tags: [] } });
    workspaceIds.unshift(uid);

    const workspacesData = await getOrganisationObjects(workspaceIds);

    try {
      workspaces = workspaces.map((workspace) => {
        const workspaceData = workspacesData.find((x) => x.id === workspace.id);
        return {
          ...workspace,
          id: workspaceData?.id || req.params.organisation,
          name: workspaceData?.name || 'Your Actions',
          initials: workspaceData?.name.split(' ').map(
            (n, i, a) => (i === 0 || i + 1 === a.length ? n[0] : null),
          ).join('').toUpperCase() || 'YA',
        };
      });
      workspaces = workspaces.map((workspace) => {
        if (workspace.id === req.params.organisation) {
          req.decodedClaims.permission = workspace.permission;
          return { selected: true, ...workspace };
        } return workspace;
      });
      req.workspaces = workspaces;

      // if user is not owner check they have permissions
      if (uid !== orgId) {
        if (!hasWorkspacePermission(orgId, req.workspaces)) throw new Error(401);
      }
    } catch (e) {
      next(e);
    }
  }
  next();
};

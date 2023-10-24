const session = require('express-session');
const OidcStrategy = require('passport-openidconnect').Strategy;

module.exports.init = (app, passport) => {
  app.use(session({
    secret: 'my-super-secret',
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, next) => {
    next(null, {id: user.id, name: user.displayName});
  });

  passport.deserializeUser((obj, next) => {
    next(null, obj);
  });

  // config SimpleLogin OIDC (OpenID Connect) provider
  passport.use(new OidcStrategy({
    // SimpleLogin OIDC Settings
    issuer: 'https://app.simplelogin.io',
    authorizationURL: 'https://app.simplelogin.io/oauth2/authorize',
    tokenURL: 'https://app.simplelogin.io/oauth2/token',
    userInfoURL: 'https://app.simplelogin.io/oauth2/userinfo',
    // SimpleLogin App Credential from env
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    // you might need to change the callbackURL when deploying on production
    callbackURL: 'http://localhost:3000/callback',
    // openid needs to be in scope
    scope: 'openid'
  }, (issuer, profile, done) => {
    return done(null, profile);
  }));
}

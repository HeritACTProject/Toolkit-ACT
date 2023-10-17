const compression = require('compression');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { engine } = require('express-handlebars');
const helmet = require('helmet');
const createHttpError = require('http-errors');

const session = require('express-session');
const passport = require('passport');
const OidcStrategy = require('passport-openidconnect').Strategy;
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

const ensureLoggedIn = ensureLogIn();

const appRouter = require('./routes/app.js');
const orgRouter = require('./routes/org.js');

const app = express();

const db = require('./models/organisations.js')
db.init();

// view engine setup
app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: `${__dirname}/views/layouts/`,
  partialsDir: `${__dirname}/views/partials/`,
  helpers: {
    ifEquals(arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    },
  },
}));
app.set('view engine', 'hbs');

app.use(compression());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// security
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'style-src': [
        "'self'",
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
        "'unsafe-inline'",
      ],
      'script-src': [
        "'self'",
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
      ],
      'img-src': [
        "'self'",
        "https://unpkg.com/leaflet@1.9.4/dist/images/",
        "http://a.tile.openstreetmap.org",
        "http://b.tile.openstreetmap.org",
        "http://c.tile.openstreetmap.org",
      ],
    },
  },
}));

// auth middleware
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

// setup routers
app.use('/', appRouter);
app.use('/organisation', ensureLoggedIn, orgRouter);
app.use('/login', passport.authenticate('openidconnect'));
app.use('/callback',
  passport.authenticate('openidconnect', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
  })
);

app.listen(3000, () => {
  console.log('Server up')
});

app.use((err, req, res, next) => {
  if (err.message === '401' || err.status === 401) {
    const error = createHttpError(401, 'Sorry you can\'t view this page');

    if (process.env.NODE_ENV === 'production') error.stack = null;

    res.status(err.status || 401);
    res.render('error', {
      layout: false,
      error: {
        secondaryMsg: err.message || '401',
        ...error,
      },
    });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.message === '404' || err.status === 404) {
    const error = createHttpError(404, 'Sorry we can\'t find that page');

    if (process.env.NODE_ENV === 'production') error.stack = null;

    res.status(err.status || 404);
    res.render('error', {
      layout: false,
      error: {
        secondaryMsg: err.message,
        ...error,
      },
    });
  } else next(err);
});

app.use((err, req, res, next) => {
  const error = createHttpError.InternalServerError('Something went wrong!', err);
  console.error(err);

  if (process.env.NODE_ENV === 'production') error.stack = null;

  res.status(err.status || 500);
  res.render('error', {
    layout: false,
    error: {
      secondaryMsg: 'Please try again',
      ...error,
    },
  });
});

app.use((err, req, res, next) => {
  res.status(404);
  res.render('error', { layout: false, error: { message: 'Sorry we can\'t find that page' } });
});

module.exports = app;

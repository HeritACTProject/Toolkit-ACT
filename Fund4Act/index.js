const compression = require('compression');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { engine } = require('express-handlebars');
const createHttpError = require('http-errors');

const passport = require('passport');

const auth = require('./middleware/auth.js');
const security = require('./middleware/security.js');
const appRouter = require('./routes/app.js');
const profileRouter = require('./routes/profile.js');
const projectRouter = require('./routes/project.js');

const app = express();

const profileDb = require('./models/profiles.js')
profileDb.init();
const projDb = require('./models/projects.js')
projDb.init();
const pledgeDb = require('./models/pledges.js')
pledgeDb.init();

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
security.init(app);

// auth middleware
auth.init(app, passport);

// setup routers
app.use('/', appRouter);
app.use('/profile', profileRouter);
app.use('/project', projectRouter);
app.get('/login', passport.authenticate('SimpleLogin'));
app.use('/callback', passport.authenticate('SimpleLogin', { failureRedirect: '/login', keepSessionInfo: true}), 
(req, res) => {
  res.redirect(req.session.returnTo ||'/');
  delete req.session.returnTo;
});

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

app.use((req, res, next) => {
  res.status(404);
  res.render('error', { layout: false, error: { message: 'Sorry we can\'t find that page' } });
});

module.exports = app;

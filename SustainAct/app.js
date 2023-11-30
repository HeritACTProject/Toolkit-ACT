/* eslint-disable no-unused-vars */
const compression = require('compression');
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('logops');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
const helmet = require('helmet');
const createHttpError = require('http-errors');
const indexRouter = require('./routes/index');
const appRouter = require('./routes/app');

const app = express();

// view engine setup
app.engine('hbs', hbs({
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

// connect to mongoDB
const dbUrl = `mongodb+srv://${process.env.ATLAS_UNAME}:${process.env.ATLAS_PASSWORD}@cluster0.2aiujm5.mongodb.net/SustainAct?retryWrites=true&w=majority`;
mongoose.connect(
  dbUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
);
// eslint-disable-next-line no-console
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
  logger.info('db connetion success');
});

app.use(compression());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// security
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'style-src': [
        "'self'",
        'maxcdn.bootstrapcdn.com',
        'fonts.googleapis.com',
        'https://www.gstatic.com/firebasejs/',
        'https://cdnjs.cloudflare.com/ajax/libs/',
        "'unsafe-inline'"], // unsafe
      'script-src': ["'self'", 'ka-f.fontawesome.com', 'kit.fontawesome.com', 'code.jquery.com', 'cdn.jsdelivr.net',
        'https://cdnjs.cloudflare.com/ajax/libs/',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js',
        'https://d3js.org/d3.v4.min.js',
        "'unsafe-inline'"],
      'default-src': ["'self'",
        `https://${process.env.PROJECTID}.firebaseapp.com/`,
        `https://europe-west1-${process.env.PROJECTID}.cloudfunctions.net/`,
        'https://identitytoolkit.googleapis.com/',
        'https://www.googleapis.com/'],
      'img-src': [
        "'self'",
        'data:',
        'https://www.gstatic.com/firebasejs/',
        'https://lh3.googleusercontent.com/',
      ],
    },
  },
}));

// setup routers
app.use('/', indexRouter);
app.use('/app/', appRouter);

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
  logger.error(err);

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

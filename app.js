require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressSession = require('express-session');
const flash = require('connect-flash');

const db = require('./db');
const users = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: 'digilocksec',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Initialize Passport
const initPassport = require('./auth/init');
initPassport(passport);

const routes = require('./routes/index')(passport);

app.use('/', routes);
app.use('/users', users);
app.use('/img/', express.static(path.join(__dirname, 'public/img')));
app.use('/bg/', express.static(path.join(__dirname, 'public/bg')));
app.use('/js/', express.static(path.join(__dirname, 'public/js')));
app.use('/css/', express.static(path.join(__dirname, 'public/css')));
app.use('/library/', express.static(path.join(__dirname, 'public/library')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

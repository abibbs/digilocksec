const express = require('express');
const router = express.Router();
const path = require('path');
const update = require('../auth/update');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  // if the user is not authenticated then redirect them to the login page
  res.redirect('/');
}

module.exports = function(passport) {

  /* GET index. */
  router.get('/', function(req, res, next) {
    res.location('/');
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });

  /* GET home page. */
  router.get('/home', isAuthenticated, function(req, res, next) {
    if (req.user) {console.log("req.user",req.user);}
    res.location('/home');
    res.sendFile(path.join(__dirname, '../public', 'home.html'));
  });

  /* GET settings page. */
  router.get('/settings', isAuthenticated, function(req, res, next) {
    if (req.user) {console.log("req.user",req.user);}
    res.location('/settings');
    res.sendFile(path.join(__dirname, '../public', 'settings.html'));
  });

  /* GET sign-up page. */
  router.get('/sign-up', function(req, res, next) {
    if (req.session.messages) {
      console.log("req.session.messages:",req.session.messages);
    }

    res.location('/sign-up');
    res.sendFile(path.join(__dirname, '../public', 'signup.html'));
  });

  /* POST sign-up */
  router.post('/sign-up', passport.authenticate('signup', {
    failureMessage: "User already exists",
    failureRedirect: '/sign-up',
    failureFlash : true
  }),function(req, res) {
    console.log('registration successful...rerouting to confirm');
    res.send({redirect: '/home'});
  });

  /* POST login */
  router.post('/login', passport.authenticate('login', {
    failureMessage: "Login failed.",
    failureRedirect: '/sign-up',
    failureFlash : true
  }),function(req, res) {
    console.log('login successful...rerouting to confirm');
    res.send({redirect: '/home'});
  });

  /* POST update settings */
  router.post('/update-settings', function(req,res) {
    update(req,res);
  });

  /* GET logout */
  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  /* GET user session data */
  router.get('/api/user_data', function(req, res) {
    if (req.user === undefined) {
      // The user is not logged in
      res.json({});
    } else {
      res.json({
        user: req.user
      });
    }
  });

  /* GET user errors */
  router.get('/api/user_errors', function(req, res) {
    console.log('/api/user_errors',req.session.messages);

    if (req.session.messages === undefined || !req.session.messages.length) {
      // No errors
      res.json({});
    } else {
      res.json({
        errors: req.session.messages
      });
    }
    req.session.messages = [];
  });

  return router;
};

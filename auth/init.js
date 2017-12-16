const login = require('./login');
const signup = require('./signup');
const User = require('../models/user');

module.exports = function(passport) {

console.log("passport initialized");

	// allow passport to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
      console.log('serializing user: ');console.log(user);
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        console.log('deserializing user:',user);
        done(err, user);
      });
    });

    // set up passport strategies for Login and SignUp
    login(passport);
    signup(passport);
}

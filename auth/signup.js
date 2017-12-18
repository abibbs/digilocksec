const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bCrypt = require('bcrypt-nodejs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = function(passport) {

  passport.use('signup', new LocalStrategy({
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) {

    // form Welcome message
    let msg = {
      from: 'info@digilock.com',
      subject: 'Welcome to Digilock online!',
      text: 'Use digilock-demo.herokuapp.com to access your account',
      html: 'Click <a href="digilock-demo.herokuapp.com/home">here</a> to access your account.'
    };

    console.log('authentiacting...')

    function findOrCreateUser() {
      // find a user in Mongo with provided username
      User.findOne({ 'email' : username }, function(err, user) {
        // In case of any error, return using the done method
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists with email: '+username);
          return done(null, false, { message: 'User Already Exists.' });
        } else {
          // if there is no user with that email
          // create the user
          let newUser = new User();

          // set the user's local credentials
          newUser.email = username;
          newUser.password = createHash(password);

          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);
              throw err;
            }
          }).then(function(user) {
            console.log('User Registration succesful');
            msg['to'] = user.email;
            sgMail.send(msg);

            return done(null, user);
          });
        }
      });
    };
    // Delay the execution of findOrCreateUser and execute the method
    // in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }));
}

// Generates hash using bCrypt
function createHash(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

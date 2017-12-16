const User = require('../models/user');
const bCrypt = require('bcrypt-nodejs');

module.exports = function(req,res) {
  let id = req.body.id;
  let pw = req.body.password;

  User.findById(id, function (err, user) {

    if (err) {
      console.log("error!",err);
    }

    if (user) {
      user.password = createHash(pw);

      user.save(function(err) {
        if (err) {
          console.log("Couldn't update user");
          throw err;
        }
      }).then(function() {
        req.logIn(user, function(err) {
          // redirect to logged in user homepage
          res.send({redirect: '/home'});
        });
      });
    }
  });
}

// Generates hash using bCrypt
function createHash(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

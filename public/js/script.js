(function($) {
  "use strict"; // Start of use strict

  // get user session data
  if ($('.header-username').length) {
    updateUserData(function(data) {
      if (data.hasOwnProperty('user')) {
        if ($('#logged-user').length) { $('#logged-user').text(data.user.email); }
        $('.header-username').html('<a href="/home">'+data.user.email+'</a>');
      }
    },"api/user_data");
  }

  // if ($('#signup-btn').length) {
  //   updateUserData(function(data) {
  //     setTimeout(function() {
  //       if (data.hasOwnProperty('error')) {
  //         // if ($('#logged-user').length) { $('#logged-user').text(data.user.email); }
  //         // $('.header-username').html('<a href="/home">'+data.user.email+'</a>');
  //         console.log('data.errors:',data.errors);
  //       }
  //     },1000)
  //     console.log('data.errors:',data.errors);
  //   },'/api/user_errors');
  // }

  function updateUserData(cb,url) {
    $.getJSON(url, function(data) {
      // ensure the data contains the username as expected before using it
      cb(data);
    });
  }

  // email Validation
  function validEmail(email) {
    var regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return regex.test(email);
  }

  // password Validation
  function validPassword(pass,conf) {
    let alphaNum = /^[0-9a-zA-Z]+$/;
    let valid = true;
    let lengthWarn = $('#length-warn');
    let alphaNumWarn = $('#alphanum-warn');
    let genWarning = $('#generic-warning');

    if (pass !== conf) { valid = false; genWarning.removeClass('dis-none'); genWarning.text('Passwords do not match!'); }
    if (!pass.match(alphaNum)) { valid = false; alphaNumWarn.addClass('color-red'); };
    if (6 > pass.length) { valid = false; lengthWarn.addClass('color-red'); }
    return valid;
  }

  // make AJAX request
  function postRequest(body,url,cb) {
    $.ajax({
      type: "POST",
      url: url,
      data: body,
      dataType: "json",
      success: function(data,status) {
        cb(data,status);
      }
    });
  }

  // Sign-up controls
  $('#signup-btn').click(function(e) {

    let email = $('#email').val();
    let password = $('#password').val();
    let confirm = $('#confirmPassword').val();
    let genWarning = $('#generic-warning');

    // form isn't empty
    if (email && password && confirm) {

      // validate email
      if (!validEmail(email)) {
        genWarning.text('Please enter a valid email!');
        genWarning.removeClass('dis-none');
      } else {

        // validate password
        if (validPassword(password,confirm)) {
          let registerBody = {
            "username": email,
            "password": password
          };
          let registerURL = '/sign-up';
          let registerCB = function(data, status) {
            if (typeof data.redirect == 'string') { window.location = data.redirect }
          };

          postRequest(registerBody,registerURL,registerCB);
        }
      }
    } else {
      genWarning.text('Please enter your email and password!');
      genWarning.removeClass('dis-none');
    }

    e.preventDefault();
  });

  // Sign-up controls
  $('#signin-btn').click(function(e) {

    let email = $('#email').val();
    let password = $('#password').val();

    // form isn't empty
    if (email && password) {
      let signupBody = {
        "username": email,
        "password": password
      };
      let signupURL = '/login';
      let signupCB = function(data, status) {
        // sign-in successful, redirect
        if (typeof data.redirect == 'string') { window.location = data.redirect }
      };

      postRequest(signupBody,signupURL,signupCB);
    }

    e.preventDefault();
  });

  // Settings controls
  $('#update-btn').click(function(e) {

    let password = $('#password').val();
    let confirm = $('#confirmPassword').val();
    let genWarning = $('#generic-warning');

    // form isn't empty
    if (password && confirm) {
      // validate password
      if (validPassword(password,confirm)) {

        let updateBody = {}
        updateUserData(function(data) {
          updateBody['id'] = data.user._id;
          updateBody['password'] = password;
        },"api/user_data");

        let updateURL = '/update-settings';
        let updateCB = function(data, status) {
          if (typeof data.redirect == 'string') { window.location = data.redirect }
        };

        setTimeout(function() {
          postRequest(updateBody,updateURL,updateCB);
        },600);
      }
    } else {
      genWarning.removeClass('dis-none');
    }

    e.preventDefault();
  });
})(jQuery); // End of use strict

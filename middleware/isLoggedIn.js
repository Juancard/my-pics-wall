'use strict';

let errors = require('http-verror');

module.exports = function(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  } else {
    if (req.xhr)
      return res.json({
        message: {
          type: 'warning',
          text: 'Sign in first to perform this action'
        },
        redirect: {
          url: process.env.APP_URL + 'auth/twitter'
        }
      });
    res.redirect("/auth/twitter");
  }
}

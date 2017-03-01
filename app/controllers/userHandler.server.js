'use strict';

var User = require('../models/users.js');

function userHandler () {

  this.getUserByUsername = (username) => User
    .findOne({'twitter.username': username})
    .exec();

}

module.exports = userHandler;

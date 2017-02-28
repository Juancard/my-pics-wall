'use strict';

var Pic = require('../models/pics.js');
var PicState = require('../models/picStates.js');
var PicLike = require('../models/picLikes.js');
var PicLikeState = require('../models/picLikeStates.js');
var User = require('../models/users.js');
var http_verror = require('http-verror');

function picHandler () {
  this.addPic = (user, url, title, callback) => {
    return callback(false, {url, title})
  }
}

module.exports = picHandler;

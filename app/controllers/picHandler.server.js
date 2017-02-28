'use strict';

var Pic = require('../models/pics.js');
var PicState = require('../models/picStates.js');
var PicLike = require('../models/picLikes.js');
var PicLikeState = require('../models/picLikeStates.js');
var User = require('../models/users.js');
var http_verror = require('http-verror');

function picHandler () {

  this.addPic = (user, url, title, callback) => {
    let newPicState = PicState.newInstance();
    let newPic = Pic.newInstance(url, user, newPicState._id);
    newPic.save((err, picSaved) => {
      if (err)
        return callback(
          err,
          "Could not save new Pic in db"
        );
      newPicState.pic = picSaved._id;
      newPicState.save((err, picStateSaved) => {
        if (err){
          picSaved.remove();
          return callback(
            err,
            "Could not save state of new pic in db"
          );
        }
        //populate
        picSaved.state = picStateSaved;
        return callback(false, picSaved);
      })
    });
  }
  
}

module.exports = picHandler;

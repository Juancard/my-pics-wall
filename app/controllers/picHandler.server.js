'use strict';

var Pic = require('../models/pics.js');
var PicState = require('../models/picStates.js');
var PicLike = require('../models/picLikes.js');
var PicLikeState = require('../models/picLikeStates.js');
var User = require('../models/users.js');
var http_verror = require('http-verror');

function picHandler () {

  this.addPic = (user, url, title, callback) => {
    return new Promise( (resolve, reject) => {
      let newPicState = PicState.newInstance();
      let newPic = Pic.newInstance(url, title, user, newPicState._id);
      newPic.save().then(
        (picSaved) => {
          newPicState.pic = newPic._id;
          newPicState.save()
            .then(
              (newPicStateSaved) => {
                picSaved.state = newPicStateSaved;
                return resolve(picSaved);
              }
            )
            .catch(
              (err) => {
                Pic.remove(picSaved).exec().then(
                  (removed) => reject(err)
                ).catch(reject)
              }
            )
        }
      ).catch(reject);
    });

  }

}

module.exports = picHandler;

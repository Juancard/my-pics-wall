'use strict';

var Pic = require('../models/pics.js');
var PicState = require('../models/picStates.js');
var PicLike = require('../models/picLikes.js');
var PicLikeState = require('../models/picLikeStates.js');
var User = require('../models/users.js');
var http_verror = require('http-verror');

function picHandler () {

  this.addPic = (user, url, title) => {
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
  },

  this.getAllPics = () => {
    return Pic.find({})
      .populate('state').populate('user')
      .sort({ dateAdded: -1 })
      .exec();
  },

  this.getLikesFromPics = (picsId) => {
    return PicLike
      .find({
        'pic': {
          $in: picsId
        }
      }).populate('user').populate('state')
      .exec();
  },

  this.getPicById = (picId) => {
    return Pic
      .findById(picId)
      .populate('user').populate('state')
      .exec();
  }

}

module.exports = picHandler;

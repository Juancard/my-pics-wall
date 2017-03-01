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
  },

  this.removePic = (pic) => {
    return Pic
      .findById(pic._id)
      .populate('user').populate('state')
      .exec();
  },

  this.toggleLike = (pic, user) => {
    return new Promise(function(resolve, reject) {
      PicLike
        .findOne({
          'pic': pic._id,
          'user': user._id
        })
        .populate('state').exec()
        .catch(reject)
        .then((picLike) => {

          let newPicLikeState = PicLikeState.newInstance();
          if (!picLike){
            picLike = PicLike.newInstance(user._id, pic._id, newPicLikeState._id)
          } else if (picLike.state.state == 'active'){
            newPicLikeState.state = 'inactive';
          }
          picLike.state = newPicLikeState._id;

          picLike.save()
            .catch(err => reject(
                new http_verror.InternalError(
                  err, "Could not save like in database"
                )
              )
            )
            .then(picLikeSaved => {
              newPicLikeState.picLike = picLikeSaved._id;
              newPicLikeState.save()
                .catch(err => {
                  PicLike.findByIdAndRemove(picLikeSaved._id).remove().exec()
                    .catch(reject)
                    .then(removed => reject(
                        new http_verror.InternalError(
                          err, "Could not save state of like in database"
                        )
                      )
                    );
                })
                .then(stateSaved => {
                  picLikeSaved.state = stateSaved;
                  resolve(picLikeSaved);
                });
            });
        });
    });
  }

}

module.exports = picHandler;

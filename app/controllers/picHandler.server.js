'use strict';

var Pic = require('../models/pics.js');
var PicState = require('../models/picStates.js');
var PicLike = require('../models/picLikes.js');
var PicLikeState = require('../models/picLikeStates.js');
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

  this.getPicsByUser = (user) => {
    return Pic.find({'user': user._id})
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

  this.setPicLikeState = (picLike, toState) => {
    return new Promise((resolve, reject) => {
      let newState = PicLikeState.newInstance(toState, picLike._id);
      newState
        .save()
        .catch((err) => reject(
            new http_verror(
              err,
              "Could not set state to %s for pic %s",
              toState,
              newState._id
            )
          )
        )
        .then((stateSaved) => {
          picLike.state = stateSaved._id;
          picLike
            .save()
            .catch((err) => {
              PicLikeState
                .remove(stateSaved)
                .exec()
                .catch(reject)
                .then((removed) => reject(err))
              return reject(
                  new http_verror(
                    err,
                    "Could not save like %s",
                    picLike._id
                  )
                )
            })
            .then((picLike) => {
              picLike.state = stateSaved;
              return resolve(picLike);
            })
        })
      })

  }

  this.removePic = (pic) => {
    return new Promise((resolve, reject) => {
      PicLike
        .find({
          'pic': pic._id,
        })
        .populate('state')
        .exec()
        .catch(reject)
        .then((picLikes) => {
          let promises = picLikes.map(
            p => this.setPicLikeState(p, 'inactive')
          )
          Promise
            .all(promises)
            .catch(reject)
            .then((likesSaved) => {
              let newState = PicState.newInstance('inactive', pic._id);
              newState
                .save()
                .catch(err => reject(
                    new http_verror.InternalError(
                      err,
                      "Could not change state of pic to remove"
                    )
                  )
                )
                .then((stateSaved) => {
                  pic.state = stateSaved._id;
                  pic
                    .save()
                    .then(resolve)
                    .catch(reject)
                })
            })
        });
      });
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

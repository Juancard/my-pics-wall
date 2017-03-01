'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PicLike = new Schema({
  pic: {
    type: Schema.Types.ObjectId,
    ref: 'Pic',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
	dateAdded: {
    type: Date,
    required: true,
    default: Date.now
  },
  state: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'PicLikeState'
  }
});

PicLike.index({ pic: 1, user: 1}, { unique: true });

PicLike.statics
  .newInstance = function newInstance(user, pic, state) {
  let newPicLike = new this();

  newPicLike.pic = pic;
	newPicLike.user = user;
	newPicLike.state = state;

  return newPicLike;
}

module.exports = mongoose.model('PicLike', PicLike);

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PicLike = new Schema({
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

PicLike.statics
  .newInstance = function newInstance(user, state) {
  let newPicLike = new this();

	newPicLike.user = user;
	newPicLike.state = state;

  return newPicLike;
}

module.exports = mongoose.model('PicLike', PicLike);

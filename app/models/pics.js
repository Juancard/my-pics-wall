'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Pic = new Schema({
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
    ref: 'PicState'
  },
	url: {
    type: String,
    required: true
  }
});

Pic.statics
  .newInstance = function newInstance(user, state, url) {
  let newPic = new this();

	newPic.user = user;
	newPic.state = state;
  newPic.url = url;

  return newPic;
}

module.exports = mongoose.model('Pic', Pic);

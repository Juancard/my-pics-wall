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
  },
  title: {
    type: String,
    required: true,
    validate : [
      (t) => t.length > 3 && t.length < 20,
      'Title length is out of range'
    ]
  }
});

Pic.statics
  .newInstance = function newInstance(url, title, user, state) {
  let newPic = new this();

  newPic.url = url;
  newPic.title = title;
	newPic.user = user;
	newPic.state = state;

  return newPic;
}

module.exports = mongoose.model('Pic', Pic);

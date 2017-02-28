'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema({
	twitter: {
		id: String,
		displayName: String,
		username: String,
		imageUrl: String
	}
});

User.statics
  .newInstance = function newInstance(strategy, id,
		username, displayName, imageUrl) {
  let newUser = new this();

	newUser[strategy].id = id;
	newUser[strategy].displayName = displayName;
	newUser[strategy].username = username;
	newUser[strategy].imageUrl = imageUrl;

  return newUser;
}

module.exports = mongoose.model('User', User);

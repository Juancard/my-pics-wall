'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StateHandler = require('../controllers/stateHandler.db.js')

const STATES = ['inactive', 'active'];
const DEFAULT_STATE_NUMBER = 0
const stateHandler = new StateHandler(STATES, DEFAULT_STATE_NUMBER);

var PicLikeState = new Schema({
	pic: {
    type: Schema.Types.ObjectId,
    ref: 'Pic'
  },
  date: {
    type: Date,
		required: true,
    default: Date.now
  },
	state: {
		type: Number,
		min: 0,
    max: STATES.length - 1,
		required: true,
		set: stateHandler.stateStringToNumber,
		get: stateHandler.stateNumberToString
	},
});

PicLikeState.set('toObject', { getters: true });
PicLikeState.index({ picState: 1, date: -1}, { unique: true });

PicLikeState.statics
  .newInstance = function newInstance(state='active', picState=null) {
	  let newPicLikeState = new this();

		newPicLikeState.picState = picState;
		newPicLikeState.state = state;

	  return newPicLikeState;
}

PicLikeState.statics.getStateNumber = stateHandler.stateStringToNumber;

module.exports = mongoose.model('PicLikeState', PicLikeState);

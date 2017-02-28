'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StateHandler = require('../controllers/stateHandler.db.js')

const STATES = ['inactive', 'active'];
const DEFAULT_STATE_NUMBER = 0
const stateHandler = new StateHandler(STATES, DEFAULT_STATE_NUMBER);

var PicState = new Schema({
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

PicState.set('toObject', { getters: true });
PicState.index({ picState: 1, date: -1}, { unique: true });

PicState.statics
  .newInstance = function newInstance(state='active', picState=null) {
	  let newPicState = new this();

		newPicState.picState = picState;
		newPicState.state = state;

	  return newPicState;
}

PicState.statics.getStateNumber = stateHandler.stateStringToNumber;

module.exports = mongoose.model('PicState', PicState);

'use strict';

function stateHandler (states = [], defaultStatePosition=0) {
  this.states = states,
  this.defaultStatePosition = defaultStatePosition,

  this.stateStringToNumber = (stateString) => {
    stateString = stateString.trim().toLowerCase();
    let stateNumber = this.states.indexOf(stateString);
    return (stateString == -1)? this.defaultStatePosition : stateNumber;
  },

  this.stateNumberToString = (stateNumber) => {
    if (stateNumber >= this.states.length)
      stateNumber = this.defaultStatePosition;
    return this.states[stateNumber];
  }
}

module.exports = stateHandler;

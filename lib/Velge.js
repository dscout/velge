var merge = require('./utils/merge');
var Store = require('./Store');
var UI    = require('./UI');

// setOptions
// addChoice
// remChoice
// addChosen
// remChosen
// getChoices
// getChosen
// on/off/emit

var Velge = function(element) {
  this.element = element;
  this.store   = new Store();
  this.ui      = new UI();
};

merge(Velge.prototype, {
  setup: function() {
    return this;
  }
});

module.exports = Velge;

var merge = require('./utils/merge');
var Store = require('./Store');

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
};

merge(Velge.prototype, {
  setup: function() {
    return this;
  }
});

module.exports = Velge;

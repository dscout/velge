var merge       = require('./utils/merge');
var ChoiceStore = require('./stores/ChoiceStore');

var Velge = function(element) {
  this.element = element;
  this.store   = new ChoiceStore();
};

merge(Velge.prototype, {
  setup: function() {
    return this;
  }
});

module.exports = Velge;

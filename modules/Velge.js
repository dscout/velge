var merge       = require('./utils/merge');
var ChoiceStore = require('./stores/ChoiceStore');
var Wrapper     = require('./components/Wrapper');

var Velge = function(element) {
  this.element = element;
  this.store   = new ChoiceStore();
  this.wrapper = new Wrapper({ element: element });
};

merge(Velge.prototype, {
  setup: function() {
    this.render();

    return this;
  },

  render: function() {
    var options = {
      choices: this.store.allNames()
    }

    this.wrapper.render(options);
  },

  addChoice: function(choice) {
    this.store.add(choice);
    this.render();
  }
});

module.exports = Velge;

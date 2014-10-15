var merge       = require('./utils/merge');
var emitter     = require('./utils/emitter');
var ChoiceStore = require('./stores/ChoiceStore');
var Wrapper     = require('./components/Wrapper');

var ADD_EVENT    = 'add';
var REMOVE_EVENT = 'remove';

var Velge = function(element, options) {
  options = options || {};

  this.element = element;
  this.store   = new ChoiceStore();
  this.wrapper = new Wrapper(element);

  this._preloadChoiceStore(options);
};

merge(Velge.prototype, emitter, {
  setup: function() {
    this.render();

    return this;
  },

  render: function() {
    var options = {
      choices: this.store.choiceNames(),
      chosen:  this.store.chosenNames()
    };

    this.wrapper.render(options);
  },

  addChoice: function(choice) {
    this.store.addChoice(choice);
    this.render();

    return this;
  },

  addChosen: function(choice, options) {
    options = options || {};
    if (!options.silent) this.emit(ADD_EVENT, choice);

    this.store.addChosen(choice);
    this.render();

    return this;
  },

  remChoice: function(choice) {
    this.store.delete(choice);
    this.render();

    return this;
  },

  remChosen: function(choice, options) {
    options = options || {};
    if (!options.silent) this.emit(REMOVE_EVENT, choice);

    this.store.reject(choice);
    this.render();

    return this;
  },

  getChoices: function() {
    return this.store.all();
  },

  getChosen: function() {
    return this.store.filter({ chosen: true });
  },

  _preloadChoiceStore: function(options) {
    var choices = options.choices || [];
    var chosen  = options.chosen || [];

    choices.forEach(function(choice) {
      this.store.addChoice(choice);
    }, this);

    chosen.forEach(function(choice) {
      this.store.addChosen(choice);
    }, this);
  }
});

module.exports = Velge;

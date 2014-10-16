var bubble      = require('./utils/bubble');
var emitter     = require('./utils/emitter');
var merge       = require('./utils/merge');
var ChoiceStore = require('./stores/ChoiceStore');
var Wrapper     = require('./components/Wrapper');

var ADD_EVENT    = 'add';
var REMOVE_EVENT = 'remove';

var Velge = function(element, options) {
  options = options || {};

  this.element = element;
  this.store   = new ChoiceStore();
  this.wrapper = new Wrapper(element, this.store);

  this._bubbleEvents();
  this._preloadChoiceStore(options);
};

merge(Velge.prototype, emitter, bubble, {
  setup: function() {
    this.wrapper.render();

    return this;
  },

  addChoice: function(choice) {
    this.store.addChoice(choice);

    return this;
  },

  addChosen: function(choice, options) {
    this.store.addChosen(choice);

    return this;
  },

  remChoice: function(choice) {
    this.store.delete(choice);

    return this;
  },

  remChosen: function(choice, options) {
    this.store.reject(choice.name);

    return this;
  },

  getChoices: function() {
    return this.store.all();
  },

  getChosen: function() {
    return this.store.filter({ chosen: true });
  },

  _bubbleEvents: function() {
    this.bubble(this.wrapper, 'blur');
    this.bubble(this.wrapper, 'focus');
    this.bubble(this.store,   'add');
    this.bubble(this.store,   'remove');
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

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
  this.store   = new ChoiceStore(options);
  this.wrapper = new Wrapper(element, this.store);

  this._bubbleEvents();
  this._preloadChoiceStore(options);
  this._render();
};

merge(Velge.prototype, emitter, bubble, {
  setOptions: function(options) {
    if (options.comparator) this.store.comparator = options.comparator;
    if (options.limitation) this.store.limitation = options.limitation;

    this._render();
  },

  add: function(choice) {
    this.store.add(choice);

    return this;
  },

  choose: function(choice, options) {
    this.store.choose(choice);

    return this;
  },

  delete: function(choice) {
    this.store.delete(choice);

    return this;
  },

  reject: function(choice, options) {
    this.store.reject(choice);

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
    this.bubble(this.store,   'choose');
    this.bubble(this.store,   'delete');
    this.bubble(this.store,   'reject');
  },

  _preloadChoiceStore: function(options) {
    var choices = options.choices || [];
    var chosen  = options.chosen || [];

    choices.forEach(function(choice) {
      this.store.add(choice);
    }, this);

    chosen.forEach(function(choice) {
      this.store.choose(choice);
    }, this);
  },

  _render: function() {
    this.wrapper.render();
  }
});

module.exports = Velge;

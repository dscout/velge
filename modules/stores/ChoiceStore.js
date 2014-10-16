var emitter = require('../utils/emitter');
var merge   = require ('../utils/merge');

var ChoiceStore = function() {
  this.objects = {};
};

var ADD_EVENT    = 'add';
var CHANGE_EVENT = 'change';
var REMOVE_EVENT = 'remove';

merge(ChoiceStore.prototype, emitter, {
  isValid: function(value) {
    return !/^\s*$/.test(value)
  },

  addChoice: function(object) {
    object.chosen = false
    this._add(object);

    this.emit(CHANGE_EVENT);

    return this;
  },

  addChosen: function(object) {
    object.chosen = true;
    this._add(object);

    this.emit(ADD_EVENT, object);
    this.emit(CHANGE_EVENT);

    return this;
  },

  delete: function(object) {
    delete this.objects[this._normalize(object.name)];

    this.emit(CHANGE_EVENT);

    return this;
  },

  choose: function(name) {
    this._update(name, true);

    return this;
  },

  reject: function(name) {
    this._update(name, false);

    return this;
  },

  all: function() {
    var objects = this.objects;

    return Object.keys(objects).map(function(key) {
      return objects[key];
    });
  },

  allNames: function() {
    return this.all().map(function(object) {
      return object.name;
    });
  },

  choiceNames: function() {
    return this._filteredNames(false);
  },

  chosenNames: function() {
    return this._filteredNames(true);
  },

  filter: function(criteria) {
    return this.all().filter(function(object) {
      return object.chosen === criteria.chosen;
    });
  },

  fuzzy: function(value) {
    var value   = this._sanitize(value);
    var query   = /^\s*$/.test(value) ? '.*' : value;
    var regex   = RegExp(query, 'i');
    var objects = this.objects;

    return this.all().filter(function(object) {
      return regex.test(object.name);
    });
  },

  _add: function(object) {
    object.name = this._normalize(object.name);
    this.objects[object.name] = object;
  },

  _update: function(name, chosen) {
    var original = this.objects[this._normalize(name)];
    var event = chosen ? ADD_EVENT : REMOVE_EVENT;

    if (original) {
      original.chosen = chosen;

      this.emit(event, original);
      this.emit(CHANGE_EVENT);
    }
  },

  _filteredNames: function(chosen) {
    return this.filter({ chosen: chosen }).map(function(object) {
      return object.name;
    });
  },

  _normalize: function(value) {
    return String(value).toLowerCase().replace(/(^\s*|\s*$)/g, '');
  },

  _sanitize: function(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&")
  }
});

module.exports = ChoiceStore;

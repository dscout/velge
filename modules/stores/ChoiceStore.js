var merge = require ('../utils/merge');

var ChoiceStore = function() {
  this.objects = {};
};

merge(ChoiceStore.prototype, {
  isValid: function(value) {
    return !/^\s*$/.test(value)
  },

  isEmpty: function() {
    return !Object.keys(this.objects).length;
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

  addChoice: function(object) {
    object.chosen = false
    this._add(object);

    return this;
  },

  addChosen: function(object) {
    object.chosen = true;
    this._add(object);

    return this;
  },

  delete: function(name) {
    delete this.objects[this._normalize(name)];

    return this;
  },

  fuzzy: function(value) {
    var value   = this._sanitize(value);
    var query   = /^\s*$/.test(value) ? '.*' : value;
    var regex   = RegExp(query, 'i');
    var objects = this.objects;

    return Object.keys(objects).reduce(function(memo, key) {
      var object = objects[key];

      if (regex.test(object.name)) memo.push(object);

      return memo;
    }, []);
  },

  _add: function(object) {
    object.name = this._normalize(object.name);
    this.objects[object.name] = object;
  },

  _filteredNames: function(chosen) {
    return this.all().filter(function(object) {
      return object.chosen === chosen;
    }).map(function(object) {
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

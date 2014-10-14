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

  add: function(object) {
    object.name   = this._normalize(object.name);
    object.chosen = false;

    this.objects[object.name] = object;

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

  _normalize: function(value) {
    return String(value).toLowerCase().replace(/(^\s*|\s*$)/g, '');
  },

  _sanitize: function(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&")
  }
});

module.exports = ChoiceStore;

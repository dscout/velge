!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Velge=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var merge = _dereq_ ('./utils/merge');

var Store = function() {
  this.objects = {};
};

merge(Store.prototype, {
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

module.exports = Store;

},{"./utils/merge":4}],2:[function(_dereq_,module,exports){
var merge = _dereq_('./utils/merge');
var Store = _dereq_('./Store');

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

},{"./Store":1,"./utils/merge":4}],3:[function(_dereq_,module,exports){
module.exports = _dereq_('./Velge');

},{"./Velge":2}],4:[function(_dereq_,module,exports){
module.exports = function(object) {
  [].slice.call(arguments, 1).forEach(function(source) {
    for (var prop in source) {
      object[prop] = source[prop];
    }
  });

  return object;
};

},{}]},{},[3])
(3)
});
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Velge=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var merge       = _dereq_('./utils/merge');
var ChoiceStore = _dereq_('./stores/ChoiceStore');
var Wrapper     = _dereq_('./components/Wrapper');

var Velge = function(element, options) {
  options = options || {};

  this.element = element;
  this.store   = new ChoiceStore();
  this.wrapper = new Wrapper(element);

  this._preloadChoiceStore(options);
};

merge(Velge.prototype, {
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
  },

  addChosen: function(choice) {
    this.store.addChosen(choice);
    this.render();
  },

  _preloadChoiceStore: function(options) {
    var choices = options.choices || [];
    var chosens = options.chosens || [];

    choices.forEach(function(choice) {
      this.store.addChoice(choice);
    }, this);

    chosens.forEach(function(choice) {
      this.store.addChosen(choice);
    }, this);
  }
});

module.exports = Velge;

},{"./components/Wrapper":5,"./stores/ChoiceStore":7,"./utils/merge":9}],2:[function(_dereq_,module,exports){
var emphasize    = _dereq_('../utils/emphasize');
var merge        = _dereq_('../utils/merge');
var EventEmitter = _dereq_('events').EventEmitter;

var Dropdown = function() {
  this.element = document.createElement('ol');
};

var SELECT_EVENT = 'select';

merge(Dropdown.prototype, EventEmitter.prototype, {
  render: function(choices, options) {
    choices = choices || [];
    options = options || {};

    this._updateClassNames();
    this._clearItems();
    this._renderItems(choices, options);

    return this.element;
  },

  open: function() {
    this.isOpen = true;
    this.render();
  },

  close: function() {
    this.isOpen = false;
    this.render();
  },

  toggle: function() {
    this.isOpen = !this.isOpen;
    this.render();
  },

  handleClickName: function(name) {
    this.emit(SELECT_EVENT, name);
  },

  _updateClassNames: function() {
    var names = ['velge-dropdown'];

    if (this.isOpen) names.push('open');

    this.element.className = names.join(' ');
  },

  _clearItems: function() {
    var child;

    while (child = this.element.firstChild) {
      this.element.removeChild(child);
    }
  },

  _renderItems: function(choices, options) {
    var highlight = options.highlight;
    var emphasis  = options.emphasis;

    choices.forEach(function(name) {
      var li = document.createElement('li');

      if (name === highlight) li.className = 'highlighted';

      li.innerHTML = emphasize(name, emphasis);
      li.addEventListener('click', this.handleClickName.bind(this, name));

      this.element.appendChild(li);
    }, this);
  }
});

module.exports = Dropdown;

},{"../utils/emphasize":8,"../utils/merge":9,"events":10}],3:[function(_dereq_,module,exports){
var merge        = _dereq_('../utils/merge');
var EventEmitter = _dereq_('events').EventEmitter;

var Input = function() {
  this.element = document.createElement('input');
};

var keycodes = {
  BACKSPACE: 8,
  TAB:       9,
  ENTER:     13,
  ESCAPE:    27,
  LEFT:      37,
  UP:        38,
  RIGHT:     39,
  DOWN:      40,
  COMMA:     188
};

merge(Input.prototype, EventEmitter.prototype, {
  render: function(value) {
    this.element.type                    = 'text';
    this.element.attributes.autocomplete = 'off';
    this.element.placeholder             = 'Placeholder';
    this.element.className               = 'velge-input';

    if (value) this.element.value = value;

    this.element.addEventListener('blur',    this.handleBlur.bind(this));
    this.element.addEventListener('focus',   this.handleFocus.bind(this));
    this.element.addEventListener('keydown', this.handleKeydown.bind(this));

    return this.element;
  },

  handleKeydown: function(event) {
    switch(event.keyCode) {
      case keycodes.ENTER:
        this._emitAdd();
        break;
      case keycodes.COMMA:
        this._emitAdd();
        break;
      case keycodes.LEFT:
        this._emitNavigate('left');
        break;
      case keycodes.UP:
        this._emitNavigate('up');
        break;
      case keycodes.RIGHT:
        this._emitNavigate('right');
        break;
      case keycodes.DOWN:
        this._emitNavigate('down');
        break;
      default:
        this._emitChange();
    }
  },

  handleBlur: function() {
    this.emit('blur');
  },

  handleFocus: function() {
    this.emit('focus');
  },

  _emitAdd: function() {
    var value = this.element.value;

    if (value && value !== '') {
      this.element.value = '';
      this.emit('add', value);
    }
  },

  _emitChange: function() {
    this.emit('change', this.element.value);
  },

  _emitNavigate: function(direction) {
    this.emit('navigate', direction);
  }
});

module.exports = Input;

},{"../utils/merge":9,"events":10}],4:[function(_dereq_,module,exports){
var merge        = _dereq_('../utils/merge');
var EventEmitter = _dereq_('events').EventEmitter;

var List = function() {
  this.element = document.createElement('ul');
};

var REMOVE_EVENT = 'remove';

merge(List.prototype, EventEmitter.prototype, {
  render: function(chosen, options) {
    options = options || {};
    chosen  = chosen  || [];

    this.element.className = 'velge-list';

    this._clearItems();
    this._renderItems(chosen, options);

    return this.element;
  },

  handleClickRemove: function(name) {
    this.emit(REMOVE_EVENT, name);
  },

  _clearItems: function() {
    var child;

    while (child = this.element.firstChild) {
      this.element.removeChild(child);
    }
  },

  _renderItems: function(chosen, options) {
    var highlight = options.highlight;

    chosen.forEach(function(name) {
      var li   = document.createElement('li');
      var span = document.createElement('span');
      var rem  = document.createElement('span');

      if (name === highlight) li.className = 'highlighted';

      span.className   = 'name';
      span.textContent = name;

      rem.className = 'remove';
      rem.innerHTML = '&times;';
      rem.addEventListener('click', this.handleClickRemove.bind(this, name));

      li.appendChild(span);
      li.appendChild(rem);

      this.element.appendChild(li);
    }, this);
  }
});

module.exports = List;

},{"../utils/merge":9,"events":10}],5:[function(_dereq_,module,exports){
var merge    = _dereq_('../utils/merge');
var Dropdown = _dereq_('./Dropdown');
var Input    = _dereq_('./Input');
var List     = _dereq_('./List');

var Wrapper = function(parent) {
  this.parent = parent;
};

merge(Wrapper.prototype, {
  render: function(options) {
    options = options || {};

    this._renderElement();
    this._renderDropdown(options);
    this._renderInput(options);
    this._renderList(options);

    return this.element;
  },

  _renderElement: function() {
    if (!this.element) {
      this.element = document.createElement('div');
      this.element.className = 'velge';
      this.parent.appendChild(this.element);
    }
  },

  _renderDropdown: function(options) {
    var choices = options.choices;

    if (!this.dropdown) {
      this.dropdown = new Dropdown();
      this.element.appendChild(this.dropdown.element);
    }

    this.dropdown.render(choices);
  },

  _renderInput: function(options) {
    this.input = new Input();
    this.element.appendChild(this.input.element);
    this.input.render();
  },

  _renderList: function(options) {
    var chosen = options.chosen;

    if (!this.list) {
      this.list = new List();
      this.element.appendChild(this.list.element);
    }

    this.list.render(chosen);
  }
});

module.exports = Wrapper;

},{"../utils/merge":9,"./Dropdown":2,"./Input":3,"./List":4}],6:[function(_dereq_,module,exports){
module.exports = _dereq_('./Velge');

},{"./Velge":1}],7:[function(_dereq_,module,exports){
var merge = _dereq_ ('../utils/merge');

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

},{"../utils/merge":9}],8:[function(_dereq_,module,exports){
module.exports = function(string, pattern) {
  var regex = new RegExp('(' + pattern + ')', 'i');

  return string.replace(regex, "<b>$1</b>");
};

},{}],9:[function(_dereq_,module,exports){
module.exports = function(object) {
  [].slice.call(arguments, 1).forEach(function(source) {
    for (var prop in source) {
      object[prop] = source[prop];
    }
  });

  return object;
};

},{}],10:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[6])
(6)
});
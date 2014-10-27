!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Velge=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var bubble      = _dereq_('./utils/bubble');
var emitter     = _dereq_('./utils/emitter');
var merge       = _dereq_('./utils/merge');
var ChoiceStore = _dereq_('./stores/ChoiceStore');
var Wrapper     = _dereq_('./components/Wrapper');

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

},{"./components/Wrapper":5,"./stores/ChoiceStore":7,"./utils/bubble":8,"./utils/emitter":10,"./utils/merge":12}],2:[function(_dereq_,module,exports){
var emphasize = _dereq_('../utils/emphasize');
var merge     = _dereq_('../utils/merge');
var emitter   = _dereq_('../utils/emitter');
var remove    = _dereq_('../utils/remove_children');

var Dropdown = function() {
  this.element = document.createElement('ol');
};

var SELECT_EVENT = 'select';

merge(Dropdown.prototype, emitter, {
  render: function(choices, options) {
    choices = choices || [];
    options = options || {};

    this._updateClassNames(choices, options.open);
    this._clearItems();
    this._renderItems(choices, options);
    this._autoScroll();

    return this.element;
  },

  handleClickName: function(name) {
    this.emit(SELECT_EVENT, name);
  },

  _updateClassNames: function(choices, shouldOpen) {
    var names = ['velge-dropdown'];

    if (shouldOpen && choices.length) names.push('open');

    this.element.className = names.join(' ');
  },

  _clearItems: function() {
    remove(this.element);
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
  },

  _autoScroll: function() {
    var listElement = this._highlightedElement();

    if (!listElement) return;

    var eHeight = listElement.offsetHeight;
    var cHeight = this.element.offsetHeight;
    var offset  = listElement.offsetTop - this.element.offsetTop;
    var scroll  = this.element.scrollTop;
    var baseTop = scroll + offset;

    if (offset < 0) {
      this.element.scrollTop = baseTop;
    } else if (offset + (eHeight > cHeight)) {
      this.element.scrollTop = baseTop - cHeight + eHeight;
    }
  },

  _highlightedElement: function() {
    return this.element.querySelector('li.highlighted');
  }
});

module.exports = Dropdown;

},{"../utils/emitter":10,"../utils/emphasize":11,"../utils/merge":12,"../utils/remove_children":13}],3:[function(_dereq_,module,exports){
var merge   = _dereq_('../utils/merge');
var emitter = _dereq_('../utils/emitter');

var Input = function() {
  this.element  = document.createElement('input');
  this.rendered = false;
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

var ADD_EVENT      = 'add';
var BLUR_EVENT     = 'blur';
var CHANGE_EVENT   = 'change';
var FOCUS_EVENT    = 'focus';
var NAVIGATE_EVENT = 'navigate';

var INPUT_DELAY = 5;
var BLUR_DELAY  = 100;

merge(Input.prototype, emitter, {
  render: function(value) {
    this._renderElement();

    if (value) this.element.value = value;

    return this.element;
  },

  handleKeydown: function(event) {
    switch(event.keyCode) {
      case keycodes.ESCAPE:
        event.stopPropagation();
        this._emitBlur();
        this._clear();
        break;
      case keycodes.ENTER:
        event.preventDefault();
        this._emitAdd();
        this._clear();
        break;
      case keycodes.COMMA:
        event.preventDefault();
        this._emitAdd();
        break;
      case keycodes.LEFT:
        this._emitNavigate('left');
        break;
      case keycodes.UP:
        event.preventDefault();
        this._emitNavigate('up');
        break;
      case keycodes.RIGHT:
        this._emitNavigate('right');
        break;
      case keycodes.DOWN:
        event.preventDefault();
        this._emitNavigate('down');
        break;
      case keycodes.TAB:
        event.preventDefault();
        this._emitNavigate('down');
        break;
      default:
        setTimeout(this._emitChange.bind(this), INPUT_DELAY);
    }
  },

  handleBlur: function() {
    var self = this;

    setTimeout(function() {
      self.emit(BLUR_EVENT);
    }, BLUR_DELAY);
  },

  handleFocus: function() {
    this.emit(FOCUS_EVENT);
  },

  _renderElement: function() {
    if (!this.rendered) {
      this.element.type                    = 'text';
      this.element.attributes.autocomplete = 'off';
      this.element.placeholder             = '';
      this.element.className               = 'velge-input';

      this.element.addEventListener('blur',    this.handleBlur.bind(this));
      this.element.addEventListener('focus',   this.handleFocus.bind(this));
      this.element.addEventListener('keydown', this.handleKeydown.bind(this));

      this.rendered = true;
    }
  },

  _clear: function() {
    this.element.value = '';
  },

  _emitAdd: function() {
    var value = this.element.value;

    if (value && value !== '') {
      this._clear();
      this.emit(ADD_EVENT, value);
    }
  },

  _emitBlur: function() {
    this.emit(BLUR_EVENT);
  },

  _emitChange: function() {
    this.emit(CHANGE_EVENT, this.element.value);
  },

  _emitNavigate: function(direction) {
    this.emit(NAVIGATE_EVENT, direction);
  }
});

module.exports = Input;

},{"../utils/emitter":10,"../utils/merge":12}],4:[function(_dereq_,module,exports){
var merge   = _dereq_('../utils/merge');
var emitter = _dereq_('../utils/emitter');
var remove  = _dereq_('../utils/remove_children');

var List = function() {
  this.element = document.createElement('ul');
};

var REMOVE_EVENT = 'remove';

merge(List.prototype, emitter, {
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
    remove(this.element);
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

},{"../utils/emitter":10,"../utils/merge":12,"../utils/remove_children":13}],5:[function(_dereq_,module,exports){
var cycle    = _dereq_('../utils/cycle');
var emitter  = _dereq_('../utils/emitter');
var merge    = _dereq_('../utils/merge');
var Dropdown = _dereq_('./Dropdown');
var Input    = _dereq_('./Input');
var List     = _dereq_('./List');

var Wrapper = function(parent, store) {
  this.parent = parent;
  this.store  = store;
  this.state  = merge({}, this.defaultState);

  this.store.on('change', this.render.bind(this));
};

merge(Wrapper.prototype, emitter, {
  defaultState: {
    index: -1,
    query: null,
    open:  false
  },

  render: function() {
    this._renderElement();
    this._renderDropdown();
    this._renderList();
    this._renderInput();

    return this.element;
  },

  setState: function(props) {
    merge(this.state, props);
    this.render();
  },

  handleDropdownSelect: function(value) {
    this.store.choose({ name: value });
    this.setState({ index: -1, query: null, open: false });
  },

  handleInputAdd: function(value) {
    this.store.choose({ name: value });
    this.setState({ index: -1, query: null, open: false });
  },

  handleInputBlur: function() {
    this.emit('blur');
    this.setState({ index: -1, query: null, open: false });
  },

  handleInputChange: function(value) {
    this.setState({ query: value, open: true });
  },

  handleInputFocus: function() {
    this.emit('focus');
  },

  handleInputNavigate: function(direction) {
    var length = this._currentChoices().length;
    var index  = cycle(this.state.index, length, direction);

    switch(direction) {
      case 'down':
        this.setState({ index: index, open: true });
        break;
      case 'up':
        this.setState({ index: index, open: true });
        break;
    }
  },

  handleListRemove: function(value) {
    this.store.reject({ name: value });
  },

  handleTriggerClick: function() {
    this.setState({ open: !this.state.open });
  },

  _renderElement: function() {
    if (!this.element) {
      this.element           = document.createElement('div');
      this.element.className = 'velge';
      this.parent.appendChild(this.element);

      this.inner           = document.createElement('div');
      this.inner.className = 'velge-inner';
      this.element.appendChild(this.inner);

      this.trigger           = document.createElement('span');
      this.trigger.className = 'velge-trigger';
      this.inner.appendChild(this.trigger);
      this.trigger.addEventListener('click', this.handleTriggerClick.bind(this));
    }
  },

  _renderDropdown: function() {
    if (!this.dropdown) {
      this.dropdown = new Dropdown();
      this.element.appendChild(this.dropdown.element);

      this.dropdown.on('select', this.handleDropdownSelect.bind(this));
    }

    this.dropdown.render(this._currentChoices(), {
      emphasis:  this.state.query,
      highlight: this._currentSelection(),
      open:      this.state.open
    });
  },

  _renderList: function() {
    var chosen = this.store.chosenNames();

    if (!this.list) {
      this.list = new List();
      this.inner.appendChild(this.list.element);

      this.list.on('remove', this.handleListRemove.bind(this));
    }

    this.list.render(chosen);
  },

  _renderInput: function() {
    if (!this.input) {
      this.input = new Input();
      this.inner.appendChild(this.input.element);

      this.input.on('add',      this.handleInputAdd.bind(this));
      this.input.on('blur',     this.handleInputBlur.bind(this));
      this.input.on('change',   this.handleInputChange.bind(this));
      this.input.on('focus',    this.handleInputFocus.bind(this));
      this.input.on('navigate', this.handleInputNavigate.bind(this));
    }

    this.input.render(this._currentSelection());
  },

  _currentChoices: function() {
    var query = this.state.query;

    return !!query ? this.store.fuzzy(query) : this.store.choiceNames();
  },

  _currentSelection: function() {
    var index   = this.state.index;
    var choices = this._currentChoices();

    return choices[index];
  }
});

module.exports = Wrapper;

},{"../utils/cycle":9,"../utils/emitter":10,"../utils/merge":12,"./Dropdown":2,"./Input":3,"./List":4}],6:[function(_dereq_,module,exports){
module.exports = _dereq_('./Velge');

},{"./Velge":1}],7:[function(_dereq_,module,exports){
var emitter = _dereq_('../utils/emitter');
var merge   = _dereq_ ('../utils/merge');

var ChoiceStore = function(options) {
  options = options || {};

  this.comparator = options.comparator;
  this.limitation = options.limitation;
  this.objects    = {};
};

var ADD_EVENT    = 'add';
var CHANGE_EVENT = 'change';
var CHOOSE_EVENT = 'choose';
var DELETE_EVENT = 'delete';
var REJECT_EVENT = 'reject';

merge(ChoiceStore.prototype, emitter, {
  isValid: function(value) {
    return !/^\s*$/.test(value);
  },

  has: function(object) {
    return !!this.objects[this._normalize(object.name)];
  },

  add: function(object) {
    this._add(object);

    this.emit(ADD_EVENT, object);
    this.emit(CHANGE_EVENT);

    return this;
  },

  choose: function(object) {
    if (!this.has(object)) this._add(object);
    if (this.limitation)   this.rejectAll();

    this._update(object, true);

    return this;
  },

  reject: function(object) {
    this._update(object, false);

    return this;
  },

  rejectAll: function() {
    this.all().forEach(function(object) {
      this._update(object, false);
    }, this);
  },

  delete: function(object) {
    delete this.objects[this._normalize(object.name)];

    this.emit(DELETE_EVENT, object);
    this.emit(CHANGE_EVENT);

    return this;
  },

  all: function() {
    var objects = this.objects;
    var mapped  = Object.keys(objects).map(function(key) {
      return objects[key];
    });

    if (this.comparator) {
      mapped = mapped.sort(this.comparator);
    }

    return mapped;
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
    var sanitized = this._sanitize(value);
    var query     = /^\s*$/.test(sanitized) ? '.*' : sanitized;
    var regex     = RegExp(query, 'i');

    return this.allNames().filter(function(name) {
      return regex.test(name);
    });
  },

  _add: function(object) {
    object.chosen = false;
    object.name   = this._normalize(object.name);

    this.objects[object.name] = object;
  },

  _update: function(object, chosen) {
    var original = this.objects[this._normalize(object.name)];
    var event = chosen ? CHOOSE_EVENT : REJECT_EVENT;

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
    return value.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
  }
});

module.exports = ChoiceStore;

},{"../utils/emitter":10,"../utils/merge":12}],8:[function(_dereq_,module,exports){
module.exports = {
  bubble: function(emitter, event) {
    emitter.on(event, this.emit.bind(this, event));
  }
};

},{}],9:[function(_dereq_,module,exports){
module.exports = function(index, length, direction) {
  if (length < 1) return -1;

  if (direction === 'down') {
    return (index + 1) % length;
  } else {
    return (index + (length - 1)) % length;
  }
};

},{}],10:[function(_dereq_,module,exports){
module.exports = {
  on: function(name, callback, context) {
    this._events = (this._events || {});
    var events = this._events[name] || (this._events[name] = []);

    events.push({ callback: callback, context: context || this });

    return this;
  },

  off: function(name, callback, context) {
    var events = this._events[name];

    if (!callback && !context) {
      delete this._events[name];
    }

    this._events[name] = events.filter(function(event) {
      return callback && callback !== event.callback ||
             context  && context  !== event.context;
    });

    return this;
  },

  emit: function(name) {
    if (!this._events) return this;

    var args   = [].slice.call(arguments, 1);
    var events = this._events[name];

    if (events) {
      events.forEach(function(event) {
        event.callback.apply(event.context, args);
      });
    }

    return this;
  }
};

},{}],11:[function(_dereq_,module,exports){
module.exports = function(string, pattern) {
  var regex = new RegExp('(' + pattern + ')', 'i');

  return string.replace(regex, "<b>$1</b>");
};

},{}],12:[function(_dereq_,module,exports){
module.exports = function(object) {
  [].slice.call(arguments, 1).forEach(function(source) {
    for (var prop in source) {
      object[prop] = source[prop];
    }
  });

  return object;
};

},{}],13:[function(_dereq_,module,exports){
module.exports = function(element) {
  var child = element.firstChild;

  while (child) {
    element.removeChild(child);
    child = element.firstChild;
  }
};

},{}]},{},[6])
(6)
});
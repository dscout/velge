!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Velge=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var bubble      = _dereq_('./utils/bubble');
var emitter     = _dereq_('./utils/emitter');
var merge       = _dereq_('./utils/merge');
var ChoiceStore = _dereq_('./stores/ChoiceStore');
var Wrapper     = _dereq_('./components/Wrapper');

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

},{"./components/Wrapper":5,"./stores/ChoiceStore":7,"./utils/bubble":8,"./utils/emitter":9,"./utils/merge":11}],2:[function(_dereq_,module,exports){
var emphasize = _dereq_('../utils/emphasize');
var merge     = _dereq_('../utils/merge');
var emitter   = _dereq_('../utils/emitter')

var Dropdown = function() {
  this.element = document.createElement('ol');
};

var SELECT_EVENT = 'select';

merge(Dropdown.prototype, emitter, {
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
    this._updateClassNames();
  },

  close: function() {
    this.isOpen = false;
    this._updateClassNames();
  },

  toggle: function() {
    this.isOpen = !this.isOpen;
    this._updateClassNames();
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

},{"../utils/emitter":9,"../utils/emphasize":10,"../utils/merge":11}],3:[function(_dereq_,module,exports){
var merge   = _dereq_('../utils/merge');
var emitter = _dereq_('../utils/emitter')

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

var ADD_EVENT      = 'add';
var BLUR_EVENT     = 'blur';
var CHANGE_EVENT   = 'change';
var FOCUS_EVENT    = 'focus';
var NAVIGATE_EVENT = 'navigate';

merge(Input.prototype, emitter, {
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
    this.emit(BLUR_EVENT);
  },

  handleFocus: function() {
    this.emit(FOCUS_EVENT);
  },

  _emitAdd: function() {
    var value = this.element.value;

    if (value && value !== '') {
      this.element.value = '';
      this.emit(ADD_EVENT, value);
    }
  },

  _emitChange: function() {
    this.emit(CHANGE_EVENT, this.element.value);
  },

  _emitNavigate: function(direction) {
    this.emit(NAVIGATE_EVENT, direction);
  }
});

module.exports = Input;

},{"../utils/emitter":9,"../utils/merge":11}],4:[function(_dereq_,module,exports){
var merge   = _dereq_('../utils/merge');
var emitter = _dereq_('../utils/emitter')

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

},{"../utils/emitter":9,"../utils/merge":11}],5:[function(_dereq_,module,exports){
var emitter  = _dereq_('../utils/emitter');
var merge    = _dereq_('../utils/merge');
var Dropdown = _dereq_('./Dropdown');
var Input    = _dereq_('./Input');
var List     = _dereq_('./List');

var Wrapper = function(parent, store) {
  this.parent = parent;
  this.store  = store;

  this.store.on('change', this.render.bind(this));
};

merge(Wrapper.prototype, emitter, {
  render: function() {
    this._renderElement();
    this._renderDropdown();
    this._renderList();
    this._renderInput();

    return this.element;
  },

  handleDropdownSelect: function(value) {
    this.store.choose({ name: value });
  },

  handleInputAdd: function(value) {
    this.store.addChosen({ name: value });
  },

  handleInputBlur: function() {
    this.emit('blur');
  },

  handleInputChange: function(value) {
    console.log(value);
  },

  handleInputFocus: function() {
    this.emit('focus');
  },

  handleInputNavigate: function(direction) {
    this.dropdown.toggle();
  },

  handleListRemove: function(value) {
    this.store.reject({ name: value });
  },

  handleTriggerClick: function() {
    this.dropdown.toggle();
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
    var choices = this.store.choiceNames();

    if (!this.dropdown) {
      this.dropdown = new Dropdown();
      this.element.appendChild(this.dropdown.element);

      this.dropdown.on('select', this.handleDropdownSelect.bind(this));
    }

    this.dropdown.render(choices);
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

    this.input.render();
  }
});

module.exports = Wrapper;

},{"../utils/emitter":9,"../utils/merge":11,"./Dropdown":2,"./Input":3,"./List":4}],6:[function(_dereq_,module,exports){
module.exports = _dereq_('./Velge');

},{"./Velge":1}],7:[function(_dereq_,module,exports){
var emitter = _dereq_('../utils/emitter');
var merge   = _dereq_ ('../utils/merge');

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

  choose: function(object) {
    var original = this.objects[this._normalize(object.name)];

    if (original) {
      original.chosen = true;

      this.emit(ADD_EVENT, original);
      this.emit(CHANGE_EVENT);
    }

    return this;
  },

  reject: function(object) {
    var original = this.objects[this._normalize(object.name)];

    if (original) {
      original.chosen = false;

      this.emit(REMOVE_EVENT, original);
      this.emit(CHANGE_EVENT);
    }

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

},{"../utils/emitter":9,"../utils/merge":11}],8:[function(_dereq_,module,exports){
module.exports = {
  bubble: function(emitter, event) {
    emitter.on(event, this.emit.bind(this, event));
  }
}

},{}],9:[function(_dereq_,module,exports){
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

},{}],10:[function(_dereq_,module,exports){
module.exports = function(string, pattern) {
  var regex = new RegExp('(' + pattern + ')', 'i');

  return string.replace(regex, "<b>$1</b>");
};

},{}],11:[function(_dereq_,module,exports){
module.exports = function(object) {
  [].slice.call(arguments, 1).forEach(function(source) {
    for (var prop in source) {
      object[prop] = source[prop];
    }
  });

  return object;
};

},{}]},{},[6])
(6)
});
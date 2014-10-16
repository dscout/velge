var merge   = require('../utils/merge');
var emitter = require('../utils/emitter')

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

var merge   = require('../utils/merge');
var emitter = require('../utils/emitter');

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
var INPUT_DELAY    = 5;

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
        this._clear();
        this._emitBlur();
        break;
      case keycodes.ENTER:
        event.preventDefault();
        this._emitAdd();
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
    this.emit(BLUR_EVENT);
  },

  handleFocus: function() {
    this.emit(FOCUS_EVENT);
  },

  _renderElement: function() {
    if (!this.rendered) {
      this.element.type                    = 'text';
      this.element.attributes.autocomplete = 'off';
      this.element.placeholder             = 'Placeholder';
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

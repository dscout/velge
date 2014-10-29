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

var BLUR_EVENT     = 'blur';
var CHANGE_EVENT   = 'change';
var DELETE_EVENT   = 'delete';
var ENTER_EVENT    = 'enter';
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

  clear: function() {
    this.element.value = '';
  },

  handleKeydown: function(event) {
    switch(event.keyCode) {
      case keycodes.ESCAPE:
        event.stopPropagation();
        this.emit(BLUR_EVENT);
        this.clear();
        break;
      case keycodes.ENTER:
        event.preventDefault();
        this._emitEnter();
        this.clear();
        break;
      case keycodes.COMMA:
        event.preventDefault();
        this._emitEnter();
        break;
      case keycodes.LEFT:
        if (this._isBlank()) this._emitNavigate('left');
        break;
      case keycodes.UP:
        event.preventDefault();
        this._emitNavigate('up');
        break;
      case keycodes.RIGHT:
        if (this._isBlank()) this._emitNavigate('right');
        break;
      case keycodes.DOWN:
        event.preventDefault();
        this._emitNavigate('down');
        break;
      case keycodes.TAB:
        event.preventDefault();
        this._emitNavigate('down');
        break;
      case keycodes.BACKSPACE:
        if (this._isBlank()) this.emit(DELETE_EVENT);
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
      this.element.placeholder             = 'Add';
      this.element.className               = 'velge-input';

      this.element.addEventListener('blur',    this.handleBlur.bind(this));
      this.element.addEventListener('focus',   this.handleFocus.bind(this));
      this.element.addEventListener('keydown', this.handleKeydown.bind(this));

      this.rendered = true;
    }
  },

  _isBlank: function() {
    return this.element.value === '';
  },

  _emitEnter: function() {
    var value = this.element.value;

    if (value && value !== '') {
      this.clear();
      this.emit(ENTER_EVENT, value);
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

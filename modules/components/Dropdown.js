var emphasize    = require('../utils/emphasize');
var merge        = require('../utils/merge');
var EventEmitter = require('events').EventEmitter;

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

var emphasize = require('../utils/emphasize');
var merge     = require('../utils/merge');
var emitter   = require('../utils/emitter')

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

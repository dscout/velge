var emphasize = require('../utils/emphasize');
var merge     = require('../utils/merge');
var emitter   = require('../utils/emitter');
var remove    = require('../utils/remove_children');

var Dropdown = function() {
  this.element = document.createElement('ol');
};

var SELECT_EVENT = 'select';

merge(Dropdown.prototype, emitter, {
  render: function(choices, options) {
    choices = choices || [];
    options = options || {};

    this._updateClassNames(options.open);
    this._clearItems();
    this._renderItems(choices, options);

    return this.element;
  },

  handleClickName: function(name) {
    this.emit(SELECT_EVENT, name);
  },

  _updateClassNames: function(isOpen) {
    var names = ['velge-dropdown'];

    if (isOpen) names.push('open');

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
  }
});

module.exports = Dropdown;

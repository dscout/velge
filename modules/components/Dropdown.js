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

var merge = require('../utils/merge');

var Dropdown = function() {
  this.element = document.createElement('ol');
};

merge(Dropdown.prototype, {
  render: function(names, highlighted) {
    this._updateClassNames();
    this._clearItems();
    this._renderItems(names || [], highlighted);

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

  _renderItems: function(names, highlighted) {
    names.forEach(function(name) {
      var li   = document.createElement('li');
      var span = document.createElement('span');

      if (name === highlighted) li.className = 'highlighted';

      span.className = 'name';
      span.textContent = name;

      li.appendChild(span);

      this.element.appendChild(li);
    }, this);
  },
});

module.exports = Dropdown;

var merge   = require('../utils/merge');
var emitter = require('../utils/emitter')

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

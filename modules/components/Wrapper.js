var merge    = require('../utils/merge');
var Dropdown = require('./Dropdown');
var Input    = require('./Input');
var List     = require('./List');

var Wrapper = function(options) {
  this.parent = options.element;
};

merge(Wrapper.prototype, {
  render: function(options) {
    options = options || {};

    this._renderElement();
    this._renderDropdown(options);
    this._renderInput(options);
    this._renderList(options);

    return this.element;
  },

  _renderElement: function() {
    if (!this.element) {
      this.element = document.createElement('div');
      this.element.className = 'velge';
      this.parent.appendChild(this.element);
    }
  },

  _renderDropdown: function(options) {
    var choices = options.choices;

    if (!this.dropdown) {
      this.dropdown = new Dropdown();
      this.element.appendChild(this.dropdown.element);
    }

    this.dropdown.render(choices);
  },

  _renderInput: function(options) {
    this.input = new Input();
    this.element.appendChild(this.input.element);
    this.input.render();
  },

  _renderList: function(options) {
    this.list = new List();
    this.element.appendChild(this.list.element);
    this.list.render();
  }
});

module.exports = Wrapper;

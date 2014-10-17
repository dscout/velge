var emitter  = require('../utils/emitter');
var merge    = require('../utils/merge');
var Dropdown = require('./Dropdown');
var Input    = require('./Input');
var List     = require('./List');

var Wrapper = function(parent, store) {
  this.parent = parent;
  this.store  = store;
  this.state  = {};

  this.store.on('change', this.render.bind(this));
};

merge(Wrapper.prototype, emitter, {
  render: function() {
    this._renderElement();
    this._renderDropdown();
    this._renderList();
    this._renderInput();

    return this.element;
  },

  setState: function(props) {
    merge(this.state, props);
    this.render();
  },

  handleDropdownSelect: function(value) {
    this.store.choose({ name: value });
  },

  handleInputAdd: function(value) {
    console.log('input')
    this.store.choose({ name: value });
    this.setState({ query: null });
  },

  handleInputBlur: function() {
    this.emit('blur');
    this.dropdown.close(); // TODO: Use state for this
  },

  handleInputChange: function(value) {
    this.setState({ query: value });
    this.dropdown.open();
  },

  handleInputFocus: function() {
    this.emit('focus');
  },

  handleInputNavigate: function(direction) {
    this.dropdown.toggle();
  },

  handleListRemove: function(value) {
    this.store.reject({ name: value });
  },

  handleTriggerClick: function() {
    this.dropdown.toggle();
  },

  _renderElement: function() {
    if (!this.element) {
      this.element           = document.createElement('div');
      this.element.className = 'velge';
      this.parent.appendChild(this.element);

      this.inner           = document.createElement('div');
      this.inner.className = 'velge-inner';
      this.element.appendChild(this.inner);

      this.trigger           = document.createElement('span');
      this.trigger.className = 'velge-trigger';
      this.inner.appendChild(this.trigger);
      this.trigger.addEventListener('click', this.handleTriggerClick.bind(this));
    }
  },

  _renderDropdown: function() {
    var query   = this.state.query;
    var choices = !!query ? this.store.fuzzy(query) : this.store.choiceNames();

    if (!this.dropdown) {
      this.dropdown = new Dropdown();
      this.element.appendChild(this.dropdown.element);

      this.dropdown.on('select', this.handleDropdownSelect.bind(this));
    }

    this.dropdown.render(choices, { emphasis: query });
  },

  _renderList: function() {
    var chosen = this.store.chosenNames();

    if (!this.list) {
      this.list = new List();
      this.inner.appendChild(this.list.element);

      this.list.on('remove', this.handleListRemove.bind(this));
    }

    this.list.render(chosen);
  },

  _renderInput: function() {
    if (!this.input) {
      this.input = new Input();
      this.inner.appendChild(this.input.element);

      this.input.on('add',      this.handleInputAdd.bind(this));
      this.input.on('blur',     this.handleInputBlur.bind(this));
      this.input.on('change',   this.handleInputChange.bind(this));
      this.input.on('focus',    this.handleInputFocus.bind(this));
      this.input.on('navigate', this.handleInputNavigate.bind(this));
    }

    this.input.render();
  }
});

module.exports = Wrapper;

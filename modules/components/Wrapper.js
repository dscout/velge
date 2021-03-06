var cycle    = require('../utils/cycle');
var emitter  = require('../utils/emitter');
var merge    = require('../utils/merge');
var Dropdown = require('./Dropdown');
var Input    = require('./Input');
var List     = require('./List');

var Wrapper = function(parent, store) {
  this.parent = parent;
  this.store  = store;
  this.state  = merge({}, this.defaultState);

  this.store.on('change', this.render.bind(this));
};

merge(Wrapper.prototype, emitter, {
  defaultState: {
    hIndex: -1,
    vIndex: -1,
    query:  null,
    open:   false
  },

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
    this.setState({ vIndex: -1, query: null, open: false });
  },

  handleInputEnter: function(value) {
    this.store.choose({ name: value });
    this.setState({ hIndex: -1, vIndex: -1, query: null, open: false });
  },

  handleInputDelete: function() {
    var name = this.store.chosenNames()[this.state.hIndex];
    this.store.reject({ name: name });
    this.setState({ hIndex: -1 });
  },

  handleInputBlur: function() {
    this.emit('blur');
    this.setState({ hIndex: -1, vIndex: -1, query: null, open: false });
  },

  handleInputChange: function(value) {
    this.setState({ query: value, open: true });
  },

  handleInputFocus: function() {
    this.emit('focus');
  },

  handleInputNavigate: function(direction) {
    switch(direction) {
      case 'down':
        this.setState({ vIndex: this._cycleChoice('down'), open: true });
        break;
      case 'up':
        this.setState({ vIndex: this._cycleChoice('up'), open: true });
        break;
      case 'left':
        this.setState({ hIndex: this._cycleChosen('up') });
        break;
      case 'right':
        this.setState({ hIndex: this._cycleChosen('down') });
        break;
    }
  },

  handleListRemove: function(value) {
    this.store.reject({ name: value });
  },

  handleTriggerClick: function() {
    this.setState({ open: !this.state.open });
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
    if (!this.dropdown) {
      this.dropdown = new Dropdown();
      this.element.appendChild(this.dropdown.element);

      this.dropdown.on('select', this.handleDropdownSelect.bind(this));
    }

    this.dropdown.render(this._currentChoices(), {
      emphasis:  this.state.query,
      highlight: this._currentSelection(),
      open:      this.state.open
    });
  },

  _renderList: function() {
    var chosen = this.store.chosenNames();

    if (!this.list) {
      this.list = new List();
      this.inner.appendChild(this.list.element);

      this.list.on('remove', this.handleListRemove.bind(this));
    }

    this.list.render(chosen, {
      highlight: chosen[this.state.hIndex]
    });
  },

  _renderInput: function() {
    if (!this.input) {
      this.input = new Input();
      this.inner.appendChild(this.input.element);

      this.input.on('blur',     this.handleInputBlur.bind(this));
      this.input.on('change',   this.handleInputChange.bind(this));
      this.input.on('delete',   this.handleInputDelete.bind(this));
      this.input.on('enter',    this.handleInputEnter.bind(this));
      this.input.on('focus',    this.handleInputFocus.bind(this));
      this.input.on('navigate', this.handleInputNavigate.bind(this));
    }

    this.input.render(this._currentSelection());
  },

  _currentChoices: function() {
    var query = this.state.query;

    return !!query ? this.store.fuzzy(query) : this.store.choiceNames();
  },

  _currentSelection: function() {
    var index   = this.state.vIndex;
    var choices = this._currentChoices();

    return choices[index];
  },

  _cycleChoice: function(direction) {
    var length = this._currentChoices().length;

    return cycle(this.state.vIndex, length, direction);
  },

  _cycleChosen: function(direction) {
    var length = this.store.chosenNames().length;

    return cycle(this.state.hIndex, length, direction);
  }
});

module.exports = Wrapper;

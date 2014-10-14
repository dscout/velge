module.exports = {
  keycodes: {
    a:         65,
    backspace: 8,
    tab:       9,
    enter:     13,
    escape:    27,
    left:      37,
    up:        38,
    right:     39,
    down:      40,
    comma:     188
  },

  simulateClick: function(element) {
    var event = new MouseEvent('click', {});
    element.dispatchEvent(event);
  },

  simulateKeydown: function(element, key) {
    var keyCode = this.keycodes[key];
    var event = document.createEvent('KeyboardEvent');
    event.initKeyEvent('keydown', true, true, document.defaultView, false, false, false, false, keyCode, 0);

    element.dispatchEvent(event);
  },

  simulateFocus: function(element, type) {
    var event = new FocusEvent(type);
    element.dispatchEvent(event);
  }
}

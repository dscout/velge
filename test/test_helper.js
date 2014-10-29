module.exports = {
  keycodes: {
    a:	65,
    b:	66,
    c:	67,
    d:	68,
    e:	69,
    f:	70,
    g:	71,
    h:	72,
    i:	73,
    j:	74,
    k:	75,
    l:	76,
    m:	77,
    n:	78,
    o:	79,
    p:	80,
    q:	81,
    r:	82,
    s:	83,
    t:	84,
    u:	85,
    v:	86,
    w:	87,
    x:	88,
    y:	89,
    z:	90,
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
    var event   = document.createEvent('KeyboardEvent');
    var value   = element.value;

    event.initKeyEvent('keydown', true, true, document.defaultView, false, false, false, false, keyCode, 0);

    if (keyCode > 64 && keyCode < 91) element.value = value + key;

    element.dispatchEvent(event);
  },

  simulateFocus: function(element, type) {
    var event = new FocusEvent(type);
    element.dispatchEvent(event);
  }
}

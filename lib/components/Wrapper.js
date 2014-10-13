var merge = require('../utils/merge');

var Wrapper = function(options) {
  this.element = options.element;
};

merge(Wrapper.prototype, {
  render: function() {
    var div = document.createElement('div');
    div.className = 'velge';
    this.element.appendChild(div);

    return this.element;
  }
});

module.exports = Wrapper;

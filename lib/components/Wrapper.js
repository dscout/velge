var merge = require('../utils/merge');

var Wrapper = function(options) {
  this.element = options.element;
};

merge(Wrapper.prototype, {
  template: '<div class="velge"></div>',

  render: function() {
    this.element.innerHTML = this.template;
  }
});

module.exports = Wrapper;

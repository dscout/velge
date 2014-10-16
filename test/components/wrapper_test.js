var expect  = require('chai').expect;
var Wrapper = require('../../modules/components/Wrapper');
var Store   = require('../../modules/stores/ChoiceStore');

describe('Wrapper', function() {
  var element;
  var store;

  beforeEach(function() {
    element = document.createElement('div');
    store   = new Store();
  });

  describe('#render', function() {
    it('renders into the element', function() {
      var component = new Wrapper(element, store);

      component.render();

      expect(element.querySelector('.velge')).to.exist;
    });
  });
});

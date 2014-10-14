var expect  = require('chai').expect;
var Wrapper = require('../../modules/components/Wrapper');

describe('Wrapper', function() {
  var element;

  beforeEach(function() {
    element = document.createElement('div');
  });

  describe('#render', function() {
    it('renders into the element', function() {
      var component = new Wrapper({ element: element });

      component.render();

      expect(element.querySelector('.velge')).to.exist;
    });
  });
});

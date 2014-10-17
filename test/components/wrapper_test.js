var expect  = require('chai').expect;
var Wrapper = require('../../modules/components/Wrapper');
var Store   = require('../../modules/stores/ChoiceStore');
var Helper  = require('../test_helper');

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
      expect(element.querySelector('.velge-input')).to.exist;
      expect(element.querySelector('.velge-dropdown')).to.exist;
      expect(element.querySelector('.velge-list')).to.exist;
    });
  });

  describe('fuzzy finding', function() {
    beforeEach(function() {
      store
        .add({ name: 'mcintosh' })
        .add({ name: 'melrose' })
        .add({ name: 'merton' });
    });

    it('filters choices on input', function() {
      var wrapper  = new Wrapper(element, store).render();
      var input    = wrapper.querySelector('.velge-input');
      var dropdown = wrapper.querySelector('.velge-dropdown');

      var itemsCount = function() {
        return [].slice.call(dropdown.querySelectorAll('li'));
      }

      Helper.simulateKeydown(input, 'm');
      expect(itemsCount()).to.have.length(3);

      Helper.simulateKeydown(input, 'e');
      expect(itemsCount()).to.have.length(2);
    });

    it('emphasizes matching terms', function() {
      var wrapper  = new Wrapper(element, store).render();
      var input    = wrapper.querySelector('.velge-input');
      var dropdown = wrapper.querySelector('.velge-dropdown');

      Helper.simulateKeydown(input, 'm');

      expect(dropdown.innerHTML).to.contain('<b>m</b>');
    });
  });
});

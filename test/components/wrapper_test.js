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

  describe('browsing', function() {
    beforeEach(function() {
      store
        .add({ name: 'mcintosh' })
        .add({ name: 'melrose' })
        .add({ name: 'merton' });
    });

    it('does not highlight anything when the dropdown is opened', function() {
      var wrapper  = new Wrapper(element, store).render();
      var trigger  = wrapper.querySelector('.velge-trigger');
      var dropdown = wrapper.querySelector('.velge-dropdown');

      Helper.simulateClick(trigger);

      expect(dropdown.querySelector('.highlighted')).not.to.exist;
    });

    it('keys cycle the highlight through choices', function() {
      var wrapper  = new Wrapper(element, store).render();
      var input    = wrapper.querySelector('.velge-input');
      var dropdown = wrapper.querySelector('.velge-dropdown');

      Helper.simulateKeydown(input, 'down');

      expect(dropdown.querySelector('.highlighted')).to.exist;
    });

    it('chooses the highlighted choice', function() {
      var wrapper  = new Wrapper(element, store).render();
      var input    = wrapper.querySelector('.velge-input');
      var dropdown = wrapper.querySelector('.velge-dropdown');
      var list     = wrapper.querySelector('.velge-list');

      Helper.simulateKeydown(input, 'down');
      Helper.simulateKeydown(input, 'down');
      Helper.simulateKeydown(input, 'enter');

      expect(list.textContent).to.contain('melrose');
      expect(input.value).to.be.empty;
    });
  });

  describe('fuzzy finding', function() {
    beforeEach(function() {
      store
        .add({ name: 'mcintosh' })
        .add({ name: 'melrose' })
        .add({ name: 'merton' });
    });

    it('filters choices on input', function(done) {
      var wrapper  = new Wrapper(element, store).render();
      var input    = wrapper.querySelector('.velge-input');
      var dropdown = wrapper.querySelector('.velge-dropdown');

      var itemsCount = function() {
        return [].slice.call(dropdown.querySelectorAll('li'));
      }

      Helper.simulateKeydown(input, 'm');
      Helper.simulateKeydown(input, 'e');

      setTimeout(function() {
        expect(itemsCount()).to.have.length(2);
        done();
      }, 10);
    });

    it('emphasizes matching terms', function(done) {
      var wrapper  = new Wrapper(element, store).render();
      var input    = wrapper.querySelector('.velge-input');
      var dropdown = wrapper.querySelector('.velge-dropdown');

      Helper.simulateKeydown(input, 'm');

      setTimeout(function() {
        expect(dropdown.innerHTML).to.contain('<b>m</b>');
        done();
      }, 10);
    });
  });
});

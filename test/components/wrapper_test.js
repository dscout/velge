var expect  = require('chai').expect;
var Wrapper = require('modules/components/Wrapper');
var Store   = require('modules/stores/ChoiceStore');
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
        .add({ name: 'merton' })
        .choose({ name: 'jonathan' })
        .choose({ name: 'jonagold' })
    });

    it('does not highlight anything when the dropdown is opened', function() {
      var wrapper  = new Wrapper(element, store).render();
      var trigger  = wrapper.querySelector('.velge-trigger');
      var dropdown = wrapper.querySelector('.velge-dropdown');

      Helper.simulateClick(trigger);

      expect(dropdown.querySelector('.highlighted')).not.to.exist;
    });

    it('cycles the highlight through choices', function() {
      var wrapper  = new Wrapper(element, store).render();
      var input    = wrapper.querySelector('.velge-input');
      var dropdown = wrapper.querySelector('.velge-dropdown');

      Helper.simulateKeydown(input, 'down');

      expect(dropdown.querySelector('.highlighted')).to.exist;
      expect(dropdown.querySelector('.highlighted').textContent).to.contain('mcintosh');

      Helper.simulateKeydown(input, 'down');
      expect(dropdown.querySelector('.highlighted')).to.exist;
      expect(dropdown.querySelector('.highlighted').textContent).to.contain('melrose');

      Helper.simulateKeydown(input, 'down');
      expect(dropdown.querySelector('.highlighted')).to.exist;
      expect(dropdown.querySelector('.highlighted').textContent).to.contain('merton');

      Helper.simulateKeydown(input, 'down');
      expect(dropdown.querySelector('.highlighted')).to.exist;
      expect(dropdown.querySelector('.highlighted').textContent).to.contain('mcintosh');
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

    it('cycles the highlight through chosen values', function() {
      var wrapper  = new Wrapper(element, store).render();
      var input    = wrapper.querySelector('.velge-input');
      var list     = wrapper.querySelector('.velge-list');

      Helper.simulateKeydown(input, 'left');
      expect(list.querySelector('.highlighted')).to.exist;
      expect(list.querySelector('.highlighted').textContent).to.contain('jonagold');

      Helper.simulateKeydown(input, 'left');
      expect(list.querySelector('.highlighted')).to.exist;
      expect(list.querySelector('.highlighted').textContent).to.contain('jonathan');

      Helper.simulateKeydown(input, 'right');
      expect(list.querySelector('.highlighted')).to.exist;
      expect(list.querySelector('.highlighted').textContent).to.contain('jonagold');
    });

    it('rejects the highlighted choice', function() {
      var wrapper  = new Wrapper(element, store).render();
      var input    = wrapper.querySelector('.velge-input');
      var list     = wrapper.querySelector('.velge-list');

      Helper.simulateKeydown(input, 'left');
      Helper.simulateKeydown(input, 'backspace');

      expect(list.querySelector('.highlighted')).not.to.exist;
      expect(list.textContent).not.to.contain('jonagold');
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

var expect   = require('chai').expect;
var Dropdown = require('../../lib/components/Dropdown');
var Helper   = require('../test_helper');

describe('Dropdown', function() {
  describe('#render', function() {
    it('emits a list element', function() {
      var dropdown = new Dropdown();
      var element  = dropdown.render();

      expect(element.className).to.eq('velge-dropdown');
    });

    it('lists all available choices', function() {
      var dropdown = new Dropdown();
      var element  = dropdown.render(['ida-red', 'gold-rush']);

      var items = [].slice.call(element.querySelectorAll('li'));

      expect(items).to.have.length(2);
      expect(element.textContent).to.contain('ida-red');
      expect(element.textContent).to.contain('gold-rush');
    });

    it('replaces choices when re-rendering', function() {
      var dropdown = new Dropdown();
      var element  = dropdown.element;

      dropdown.render(['ida-red', 'gold-rush']);
      dropdown.render(['jonathan']);

      var items = [].slice.call(element.querySelectorAll('li'));

      expect(items).to.have.length(1);
      expect(element.textContent).to.contain('jonathan');
    });

    it('highlights a given value', function() {
      var dropdown = new Dropdown();
      var element  = dropdown.render(['melrose', 'suncrisp'], 'suncrisp');

      var highlighted = element.querySelector('.highlighted');

      expect(highlighted).to.exist;
      expect(highlighted.textContent).to.contain('suncrisp');
    });
  });

  describe('#open', function() {
    it('applies an open class to the element', function() {
      var dropdown = new Dropdown();

      dropdown.open();

      expect(dropdown.element.className).to.contain('open');
    });
  });

  describe('#close', function() {
    it('removes an open class from the element', function() {
      var dropdown = new Dropdown();

      dropdown.open();
      dropdown.close();

      expect(dropdown.element.className).not.to.contain('open');
    });
  });

  describe('events', function() {
    it('emits a "select" event when choices are clicked', function() {
      var dropdown = new Dropdown();
      var element  = dropdown.render(['melrose']);
      var spy      = sinon.spy();
      var melrose  = element.querySelector('span');

      dropdown.on('select', spy);

      Helper.simulateClick(melrose);

      expect(spy.called).to.be.true;
      expect(spy.calledWith('melrose')).to.be.true;
    });

    it('emits a "remove" event when choice removal is clicked', function() {
      var dropdown = new Dropdown();
      var element  = dropdown.render(['melrose']);
      var spy      = sinon.spy();
      var remove   = element.querySelector('.remove');

      dropdown.on('remove', spy);

      Helper.simulateClick(remove);

      expect(spy.called).to.be.true;
      expect(spy.calledWith('melrose')).to.be.true;
    });
  });
});

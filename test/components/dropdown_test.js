var expect   = require('chai').expect;
var Dropdown = require('../../modules/components/Dropdown');
var Helper   = require('../test_helper');

describe('Dropdown', function() {
  describe('#render', function() {
    it('returns a list element', function() {
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
      var element  = dropdown.render(['melrose', 'suncrisp'], {
        highlight: 'suncrisp'
      });

      var highlighted = element.querySelector('.highlighted');

      expect(highlighted).to.exist;
      expect(highlighted.textContent).to.contain('suncrisp');
    });

    it('emphasizes particular fragments', function() {
      var dropdown = new Dropdown();
      var element  = dropdown.render(['ida red', 'red delicious'], {
        emphasis: 'red'
      });

      expect(element.innerHTML).to.contain('ida <b>red</b>');
      expect(element.innerHTML).to.contain('<b>red</b> delicious');
    });

    it('applies an open class to the element', function() {
      var dropdown = new Dropdown();
      var element = dropdown.render(['wolf river'], {
        open: true
      });

      expect(dropdown.element.className).to.contain('open');
    });
  });

  describe('events', function() {
    it('emits a "select" event when choices are clicked', function() {
      var dropdown = new Dropdown();
      var element  = dropdown.render(['melrose']);
      var spy      = sinon.spy();
      var melrose  = element.querySelector('li');

      dropdown.on('select', spy);

      Helper.simulateClick(melrose);

      expect(spy.called).to.be.true;
      expect(spy.calledWith('melrose')).to.be.true;
    });
  });
});

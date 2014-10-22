var expect = require('chai').expect;
var List   = require('modules/components/List');
var Helper = require('../test_helper');

describe('List', function() {
  describe('#render', function() {
    it('returns a list element', function() {
      var list    = new List();
      var element = list.render();

      expect(element.className).to.contain('velge-list');
    });

    it('lists all selected choices', function() {
      var list = new List();
      var element = list.render(['cox', 'pipin']);

      var items = [].slice.call(element.querySelectorAll('li'));

      expect(items).to.have.length(2);
      expect(element.textContent).to.contain('cox');
      expect(element.textContent).to.contain('pipin');
    });

    it('clears previously rendered choices', function() {
      var list    = new List();
      var element = list.element;

      list.render(['ambrosia', 'arthur turner']);
      list.render(['cameo'])

      var items = [].slice.call(element.querySelectorAll('li'));

      expect(items).to.have.length(1);
    });

    it('highlights a selected choice', function() {
      var list    = new List();
      var element = list.render(['crispin', 'mutsu'], {
        highlight: 'mutsu'
      });

      var highlighted = element.querySelector('.highlighted');

      expect(highlighted).to.exist;
      expect(highlighted.textContent).to.contain('mutsu');
    });
  });

  describe('events', function() {
    it('emits a "remove" event on click', function() {
      var list    = new List();
      var element = list.render(['jonagold']);
      var spy     = sinon.spy();
      var remove  = element.querySelector('.remove');

      list.on('remove', spy);

      Helper.simulateClick(remove);

      expect(spy.called).to.be.true;
      expect(spy.calledWith('jonagold')).to.be.true;
    });
  });
});

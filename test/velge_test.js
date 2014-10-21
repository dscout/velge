var expect = require('chai').expect;
var Velge  = require('../modules/Velge');

describe('Velge', function() {
  var element;

  beforeEach(function() {
    element = document.createElement('div');
  });

  describe('#new', function() {
    it('renders initial choices', function() {
      var velge = new Velge(element, {
        chosen:  [{ name: 'apple' }, { name: 'melon' }],
        choices: [{ name: 'apple' }, { name: 'melon' }, { name: 'banana' }]
      });

      expect(velge.element).to.exist;
      expect(element.textContent).to.contain('apple');
      expect(element.textContent).to.contain('melon');
    });
  });

  describe('#add', function() {
    it('displays the new choice', function() {
      var velge = new Velge(element);

      velge.add({ name: 'melrose' });

      expect(element.textContent).to.contain('melrose');
    });
  });

  describe('#choose', function() {
    it('displays the chosen value', function() {
      var velge = new Velge(element);

      velge.choose({ name: 'ambrosia' });

      expect(element.textContent).to.contain('ambrosia');
    });

    it('emits a "choose" event', function() {
      var velge = new Velge(element);
      var spy   = sinon.spy();

      velge.on('choose', spy);

      velge.choose({ name: 'ambrosia' });

      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('#delete', function() {
    it('removes an existing choice', function() {
      var velge = new Velge(element, {
        choices: [{ name: 'jazz' }]
      });

      velge.delete({ name: 'jazz' });

      expect(element.textContent).not.to.contain('jazz');
    });
  });

  describe('#reject', function() {
    it('removes a chosen value', function() {
      var velge = new Velge(element, {
        chosen: [{ name: 'jazz' }]
      });

      velge.reject({ name: 'jazz' });

      expect(element.textContent).to.contain('jazz');
    });

    it('emits a "reject" event', function() {
      var spy   = sinon.spy();
      var velge = new Velge(element, {
        choices: [{ name: 'jazz' }]
      });

      velge.on('reject', spy);
      velge.reject({ name: 'jazz' });

      expect(spy.called).to.be.true;
    });
  });

  describe('#getChoices', function() {
    it('returns all choices', function() {
      var velge = new Velge(element, {
        choices: [{ name: 'pink lady' }],
        chosen: [{ name: 'cox orange pippin' }]
      });

      expect(velge.getChoices()).to.have.length(2);
    });
  });

  describe('#getChosen', function() {
    it('returns all chosen', function() {
      var velge = new Velge(element, {
        choices: [{ name: 'pink lady' }],
        chosen: [{ name: 'cox orange pippin' }]
      });

      expect(velge.getChosen()).to.have.length(1);
    });
  });

  describe('#setOptions', function() {
    it('applies a comparator to the store', function() {
      var velge = new Velge(element, {
        chosen: [{ name: 'amere' }, { name: 'akane' }, { name: 'antonovka' }]
      });

      velge.setOptions({ comparator: function(a, b) {
        if      (a.name < b.name) { return -1; }
        else if (a.name > b.name) { return 1;  }
        else                      { return 0;  }
      }});

      var items = element.querySelectorAll('.velge-list .name');
      var texts = [].slice.call(items).map(function(elem) {
        return elem.textContent;
      });

      expect(texts).to.eql(['akane', 'amere', 'antonovka']);
    });
  });
});

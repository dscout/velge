var expect = require('chai').expect;
var Velge  = require('../modules/Velge');

describe('Velge', function() {
  var element;

  beforeEach(function() {
    element = document.createElement('div');
  });

  describe('#init', function() {
    it('returns the instance for chaining', function() {
      var velge = new Velge(element);

      expect(velge.setup()).to.eql(velge);
    });

    it('renders initial choices', function() {
      var velge = new Velge(element, {
        chosen:  [{ name: 'apple' }, { name: 'melon' }],
        choices: [{ name: 'apple' }, { name: 'melon' }, { name: 'banana' }]
      });

      velge.setup();

      expect(velge.element).to.exist;
      expect(element.textContent).to.contain('apple');
      expect(element.textContent).to.contain('melon');
    });
  });

  describe('#add', function() {
    it('displays the new choice', function() {
      var velge = new Velge(element).setup();

      velge.add({ name: 'melrose' });

      expect(element.textContent).to.contain('melrose');
    });
  });

  describe('#choose', function() {
    it('displays the chosen value', function() {
      var velge = new Velge(element).setup();

      velge.choose({ name: 'ambrosia' });

      expect(element.textContent).to.contain('ambrosia');
    });

    it('emits a "choose" event', function() {
      var velge = new Velge(element).setup();
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
      }).setup();

      velge.delete({ name: 'jazz' });

      expect(element.textContent).not.to.contain('jazz');
    });
  });

  describe('#reject', function() {
    it('removes a chosen value', function() {
      var velge = new Velge(element, {
        chosen: [{ name: 'jazz' }]
      }).setup();

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
});

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

  describe('#addChoice', function() {
    it('displays the new choice', function() {
      var velge = new Velge(element).setup();

      velge.addChoice({ name: 'melrose' });

      expect(element.textContent).to.contain('melrose');
    });
  });

  describe('#addChosen', function() {
    it('displays the chosen value', function() {
      var velge = new Velge(element).setup();

      velge.addChosen({ name: 'ambrosia' });

      expect(element.textContent).to.contain('ambrosia');
    });
  });

  describe('#remChoice', function() {
    it('removes an existing choice', function() {
      var velge = new Velge(element, {
        choices: [{ name: 'jazz' }]
      }).setup();

      velge.remChoice({ name: 'jazz' });

      expect(element.textContent).not.to.contain('jazz');
    });
  });

  describe('#remChosen', function() {
    it('removes a chosen value', function() {
      var velge = new Velge(element, {
        chosen: [{ name: 'jazz' }]
      }).setup();

      velge.remChosen({ name: 'jazz' });

      expect(element.textContent).to.contain('jazz');
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

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
});

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

    it('renders into the element', function() {
      var velge = new Velge(element);

      velge.setup();

      expect(velge.element).to.exist;
    });
  });

  describe('#addChoice', function() {
    it('displays the new choice', function() {
      var velge = new Velge(element).setup();

      velge.addChoice({ name: 'melrose' });

      expect(element.textContent).to.contain('melrose');
    });
  });
});

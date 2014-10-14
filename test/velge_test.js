var expect = require('chai').expect;
var Velge  = require('../lib/Velge');

describe('Velge', function() {
  describe('#init', function() {
    it('returns the instance for chaining', function() {
      var velge = new Velge();

      expect(velge.setup()).to.eql(velge);
    });

    it('renders into the element', function() {
      var element = document.createElement('div');
      var velge   = new Velge(element);

      velge.setup();

      expect(velge.element).to.exist;
    });
  });
});

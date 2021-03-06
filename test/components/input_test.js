var expect = require('chai').expect;
var Input  = require('modules/components/Input');
var Helper = require('../test_helper');

describe('Input', function() {
  describe('#render', function() {
    it('returns an input element', function() {
      var input   = new Input();
      var element = input.render();

      expect(element.className).to.contain('velge-input');
    });

    it('renders he provided value as the input value', function() {
      var input   = new Input();
      var element = input.render('cortland');

      expect(element.value).to.eq('cortland');

      input.render();
      expect(element.value).to.eq('cortland');
    });
  });

  describe('events', function() {
    it('triggers an "enter" event on "enter"', function() {
      var input   = new Input();
      var element = input.render('roma');
      var spy     = sinon.spy();

      input.on('enter', spy);

      Helper.simulateKeydown(element, 'enter');

      expect(spy.calledOnce).to.be.true;
      expect(spy.calledWith('roma')).to.be.true;
      expect(element.value).to.eq('');
    });

    it('does not trigger "enter" events with blank input', function() {
      var input   = new Input();
      var element = input.render();
      var spy     = sinon.spy();

      input.on('enter', spy);

      Helper.simulateKeydown(element, 'comma');

      expect(spy.called).to.be.false;
    });

    it('emits a "change" event when the value changes', function(done) {
      var input   = new Input();
      var element = input.render();
      var spy     = sinon.spy();

      input.on('change', spy);

      Helper.simulateKeydown(element, 'a');

      setTimeout(function() {
        expect(spy.calledOnce).to.be.true;
        done();
      }, 10);
    });

    it('emits navigation events', function() {
      var input   = new Input();
      var element = input.render();
      var spy     = sinon.spy();

      input.on('navigate', spy);

      Helper.simulateKeydown(element, 'up');

      expect(spy.calledOnce).to.be.true;
      expect(spy.calledWith('up')).to.be.true;
    });

    it('does not emit left/right navigation with actual input', function() {
      var input   = new Input();
      var element = input.render('something');
      var spy     = sinon.spy();

      input.on('navigate', spy);

      Helper.simulateKeydown(element, 'left');
      expect(spy.called).to.be.false;

      input.clear();
      Helper.simulateKeydown(element, 'left');
      expect(spy.called).to.be.true;
    });

    it('emits focus events', function(done) {
      var input    = new Input();
      var element  = input.render();
      var focusSpy = sinon.spy();
      var blurSpy  = sinon.spy();

      input.on('focus', focusSpy);
      input.on('blur', blurSpy);

      Helper.simulateFocus(element, 'focus');
      Helper.simulateFocus(element, 'blur');

      setTimeout(function() {
        expect(focusSpy.called).to.be.true;
        expect(blurSpy.called).to.be.true;
        done();
      }, 105);
    });
  });
});

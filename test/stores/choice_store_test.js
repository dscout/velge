var expect = require('chai').expect;
var Store  = require('../../modules/stores/ChoiceStore');

describe('Store', function() {
  var store;

  beforeEach(function() {
    store = new Store();
  });

  describe('#isValid', function() {
    it('is true for valid values', function() {
      expect(store.isValid('apple')).to.be.true
    });

    it('is false for blank values', function() {
      expect(store.isValid('')).to.be.false
      expect(store.isValid(' ')).to.be.false
      expect(store.isValid('\t')).to.be.false
    });
  });

  describe('#addChoice', function() {
    it('normalizes names before storing', function() {
      store.addChoice({name: 'Apple'});
      expect(store.all()[0].name).to.eq('apple');
    });

    it('does not store duplicate stored objects', function() {
      store
        .addChoice({name: 'apple'})
        .addChoice({name: 'apple'});

      expect(store.all().length).to.eq(1);
    });

    it('normalizes stored values', function() {
      store
        .addChoice({name: ' Apple '})
        .addChoice({name: undefined});

      expect(store.all()[0].name).to.eq('apple');
      expect(store.all()[1].name).to.eq('undefined');
    });

    it('emits a change event', function() {
      var spy = sinon.spy();

      store.on('change', spy);

      store.addChoice({name: 'braeburn'})

      expect(spy.called).to.be.true;
    });
  });

  describe('#addChosen', function() {
    it('flags the choice as being chosen', function() {
      store.addChosen({ name: 'cameo' });

      expect(store.all()[0].chosen).to.be.true;
    });
  });

  describe('#allNames', function() {
    it('returns a list of names only', function() {
      store.addChoice({ name: 'melrose' });

      expect(store.allNames()).to.eql(['melrose']);
    });
  });

  describe('#delete', function() {
    it('removes the matching object by name', function() {
      store.addChoice({name: 'apple'}).addChoice({name: 'MANGO'});
      store.delete({ name: 'apple' }).delete({ name: ' mango ' });

      expect(store.all()).to.be.empty;
    });
  });

  describe('#reject', function() {
    it('marks the choice as not chosen', function() {
      store.addChosen({ name: 'wolf river' });
      store.reject('wolf river');

      expect(store.chosenNames()).to.be.empty;
    });

    it('emits a "remove" event', function() {
      var spy = sinon.spy();

      store.addChosen({ name: 'wolf river' });
      store.on('remove', spy);
      store.reject('wolf river');

      expect(spy.called).to.be.true;
    });
  });

  describe('#fuzzy', function() {
    beforeEach(function() {
      store
        .addChoice({ name: 'apple' })
        .addChoice({ name: 'apricot' })
        .addChoice({ name: 'opples' });
    });

    it('finds all choices matching the query', function() {
      expect(store.fuzzy('p').length).to.eq(3)
      expect(store.fuzzy('ap').length).to.eq(2)
      expect(store.fuzzy('Ap').length).to.eq(2)
      expect(store.fuzzy('pp').length).to.eq(2)
      expect(store.fuzzy('PP').length).to.eq(2)
    });

    it('sanitizes to prevent matching errors', function() {
      expect(store.fuzzy('{}[]()*+').length).to.eq(0)
    });

    it('matches all choices without any value', function() {
      expect(store.fuzzy('').length).to.eq(3)
      expect(store.fuzzy('  ').length).to.eq(3)
    });
  });
});

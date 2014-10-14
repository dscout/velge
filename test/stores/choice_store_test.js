var expect = require('chai').expect;
var Store  = require('../../modules/stores/ChoiceStore');

describe('Store', function() {
  var store;

  describe('#isValid', function() {
    beforeEach(function() {
      store = new Store();
    });

    it('is true for valid values', function() {
      expect(store.isValid('apple')).to.be.true
    });

    it('is false for blank values', function() {
      expect(store.isValid('')).to.be.false
      expect(store.isValid(' ')).to.be.false
      expect(store.isValid('\t')).to.be.false
    });
  });

  describe('#add', function() {
    beforeEach(function() {
      store = new Store();
    });

    it('normalizes names before storing', function() {
      store.add({name: 'Apple'});
      expect(store.all()[0].name).to.eq('apple');
    });

    it('does not store duplicate stored objects', function() {
      store
        .add({name: 'apple'})
        .add({name: 'apple'});

      expect(store.all().length).to.eq(1);
    });

    it('normalizes stored values', function() {
      store
        .add({name: ' Apple '})
        .add({name: undefined});

      expect(store.all()[0].name).to.eq('apple');
      expect(store.all()[1].name).to.eq('undefined');
    });
  });

  describe('#delete', function() {
    beforeEach(function() {
      store = new Store();
    });

    it('removes the matching object by name', function() {
      store.add({name: 'apple'}).add({name: 'MANGO'});
      store.delete('apple').delete(' mango ');

      expect(store.all()).to.be.empty;
    });
  });

  describe('#isEmpty', function() {
    beforeEach(function() {
      store = new Store();
    });

    it('is empty without any stored', function() {
      expect(store.isEmpty()).to.be.true;
    });

    it('is not empty with any stored', function() {
      store.add({name: 'something'});

      expect(store.isEmpty()).to.be.false;
    });
  });

  describe('#fuzzy', function() {
    beforeEach(function() {
      store = new Store()
        .add({name: 'apple'})
        .add({name: 'apricot'})
        .add({name: 'opples'});
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

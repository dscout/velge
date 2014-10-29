var expect = require('chai').expect;
var Store  = require('modules/stores/ChoiceStore');

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

  describe('#add', function() {
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

    it('emits a change event', function() {
      var spy = sinon.spy();

      store.on('change', spy);

      store.add({name: 'braeburn'})

      expect(spy.called).to.be.true;
    });
  });

  describe('#all', function() {
    it('returns each stored object', function() {
      var objectA = { name: 'cameo' }
      var objectB = { name: 'jazz' };

      store.add(objectA).add(objectB);

      expect(store.all()).to.have.length(2);
    });

    it('returns items in sort order when a comparator is provided', function() {
      var objectA = { name: 'cameo' };
      var objectB = { name: 'jazz' };
      var objectC = { name: 'ambrosia' };

      store
        .add(objectA)
        .add(objectB)
        .add(objectC);

      store.comparator = function(a, b) {
        if      (a.name < b.name) { return -1; }
        else if (a.name > b.name) { return 1;  }
        else                      { return 0;  }
      };

      expect(store.all().map(function(obj) {
        return obj.name;
      })).to.eql(['ambrosia', 'cameo', 'jazz']);
    });
  });

  describe('#has', function() {
    it('returns true when the normalized value exists', function() {
      var object = { name: 'granny smith' };
      store.add(object);

      expect(store.has(object)).to.be.true;
    });
  });

  describe('#allNames', function() {
    it('returns a list of names only', function() {
      store.add({ name: 'melrose' });

      expect(store.allNames()).to.eql(['melrose']);
    });
  });

  describe('#delete', function() {
    it('removes the matching object by name', function() {
      store.add({name: 'apple'}).add({name: 'MANGO'});
      store.delete({ name: 'apple' }).delete({ name: ' mango ' });

      expect(store.all()).to.be.empty;
    });
  });

  describe('#choose', function() {
    it('adds objects that do not exist', function() {
      store.choose({ name: 'braeburn' });

      expect(store.all()).to.have.length(1);
    });

    it('respects the chosen limitation', function() {
      store.limitation = true;

      store.choose({ name: 'akane' });
      store.choose({ name: 'amere' });

      expect(store.all()).to.have.length(2);
      expect(store.chosenNames()).to.contain('amere');
      expect(store.choiceNames()).to.contain('akane');
    });
  });

  describe('#reject', function() {
    it('marks the choice as not chosen', function() {
      var choice = { name: 'wolf river' };
      store.choose(choice);
      store.reject(choice);

      expect(store.chosenNames()).to.be.empty;
    });

    it('emits a "reject" event', function() {
      var spy    = sinon.spy();
      var choice = { name: 'wolf river' };

      store.choose(choice);
      store.on('reject', spy);
      store.reject(choice);

      expect(spy.called).to.be.true;
    });
  });

  describe('#fuzzy', function() {
    beforeEach(function() {
      store
        .add({ name: 'apple' })
        .add({ name: 'apricot' })
        .add({ name: 'opples' });
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

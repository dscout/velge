describe 'Velge.Store', ->
  store = null

  describe '#normalize', ->
    beforeEach ->
      store = new Velge.Store()

    it 'defaults to downcasing input', ->
      expect(store.normalize('Apple')).to.eq('apple')

    it 'strips leading and trailing whitespace', ->
      expect(store.normalize(' apple ')).to.eq('apple')

    it 'is tollerant of non-string input', ->
      expect(store.normalize(null)).to.eq('null')
      expect(store.normalize(undefined)).to.eq('undefined')
      expect(store.normalize(1)).to.eq('1')

  describe '#push', ->
    beforeEach ->
      store = new Velge.Store()

    it 'normalizes names before storing', ->
      store.push(name: 'Apple')
      expect(store.objects()[0].name).to.eq('apple')

  describe '#filter', ->
    beforeEach ->
      store = new Velge.Store()
        .push(name: 'apple', chosen: false)
        .push(name: 'kiwi', chosen: true)
        .push(name: 'orange', chosen: false)

    it 'filters down by the chosen property', ->
      expect(store.filter(chosen: false).length).to.eq(2)
      expect(store.filter(chosen: true).length).to.eq(1)

  describe '#fuzzy', ->
    beforeEach ->
      store = new Velge.Store()
        .push(name: 'apple')
        .push(name: 'apricot')
        .push(name: 'opples')

    it 'finds all choices matching the query', ->
      expect(store.fuzzy('p').length).to.eq(3)
      expect(store.fuzzy('ap').length).to.eq(2)
      expect(store.fuzzy('Ap').length).to.eq(2)
      expect(store.fuzzy('pp').length).to.eq(2)
      expect(store.fuzzy('PP').length).to.eq(2)

    it 'sanitizes to prevent matching errors', ->
      expect(store.fuzzy('{}[]()*+').length).to.eq(0)

    it 'matches all choices without any value', ->
      expect(store.fuzzy('').length).to.eq(3)
      expect(store.fuzzy('  ').length).to.eq(3)

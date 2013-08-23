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

  describe '#length', ->
    it 'counts choices with a filter', ->
      store = new Velge.Store()
        .push(name: 'apple')
        .push({ name: 'kiwi' }, true)
        .push(name: 'orange')

      expect(store.length()).to.eq(2)
      expect(store.length(true)).to.eq(3)

  describe '#cycle', ->
    it 'iterates the selected index', ->
      store = new Velge.Store()
        .push(name: 'apple')
        .push(name: 'kiwi')
        .push(name: 'orange')

      store.cycle()
      expect(store.selected().name).to.eq('apple')

      store.cycle()
      expect(store.selected().name).to.eq('kiwi')

      store.cycle()
      store.cycle()
      expect(store.selected().name).to.eq('apple')

    it 'skips over chosen objects', ->
      store = new Velge.Store()
        .push(name: 'apple')
        .push({ name: 'kiwi' }, true)
        .push(name: 'orange')

      store.cycle()
      store.cycle()
      expect(store.selected().name).to.eq('orange')

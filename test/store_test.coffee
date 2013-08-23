describe 'Velge.Store', ->
  describe '#length', ->
    it 'counts choices with a filter', ->
      store = new Velge.Store()
        .push(name: 'Apple')
        .push({ name: 'Kiwi' }, true)
        .push(name: 'Orange')

      expect(store.length()).to.eq(2)
      expect(store.length(true)).to.eq(3)

  describe '#cycle', ->
    it 'iterates the selected index', ->
      store = new Velge.Store()
        .push(name: 'Apple')
        .push(name: 'Kiwi')
        .push(name: 'Orange')

      store.cycle()
      expect(store.selected().name).to.eq('Apple')

      store.cycle()
      expect(store.selected().name).to.eq('Kiwi')

      store.cycle()
      store.cycle()
      expect(store.selected().name).to.eq('Apple')

    it 'skips over chosen objects', ->
      store = new Velge.Store()
        .push(name: 'Apple')
        .push({ name: 'Kiwi' }, true)
        .push(name: 'Orange')

      store.cycle()
      store.cycle()
      expect(store.selected().name).to.eq('Orange')


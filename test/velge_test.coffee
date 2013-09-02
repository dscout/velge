describe 'Velge', ->
  velge      = null
  $container = null
  template   = '<div class="container"></div>'

  beforeEach ->
    $container = $(template).appendTo($('#sandbox'))

  afterEach ->
    $('#sandbox').empty()

  describe '#setup', ->
    it 'returns the instance for chaining', ->
      velge = new Velge($container)

      expect(velge.setup()).to.be(velge)

    it 'renders all provided choices', ->
      velge = new Velge($container,
        chosen:  [{ name: 'apple' }, { name: 'melon' }]
        choices: [{ name: 'apple' }, { name: 'melon' }, { name: 'banana' }]
      ).setup()

      expect($('.velge-list', $container)).to.contain('apple')
      expect($('.velge-list', $container)).to.contain('melon')
      expect($('.velge-list', $container)).to.not.contain('banana')
      expect($('.velge-dropdown', $container)).to.contain('banana')
      expect($('.velge-dropdown', $container)).to.not.contain('apple')
      expect($('.velge-dropdown', $container)).to.not.contain('melon')

  describe '#addChoice', ->
    beforeEach ->
      velge = new Velge($container).setup()

    it 'preopulates the dropdown menu with supplied choices', ->
      velge.addChoice(name: 'banana')

      expect($('.velge-dropdown', $container)).to.contain('banana')

    it 'does not display choices that have been chosen', ->
      velge
        .addChosen(name: 'fig')
        .addChosen(name: 'grape')
        .addChoice(name: 'fig')
        .addChoice(name: 'peach')

      expect($('.velge-dropdown', $container)).to.not.contain('fig')

  describe '#addChosen', ->
    beforeEach ->
      velge = new Velge($container).setup()

    it 'populates the chosen list with supplied tags', ->
      velge.addChosen(name: 'apple')

      expect($('.velge-list', $container)).to.contain('apple')

    it 'pops existing choices when a limit has been set', ->
      velge.setOptions(single: true)

      velge
        .addChosen(name: 'apple')
        .addChosen(name: 'carrot')
        .addChosen(name: 'avacado')

      expect($('.velge-list', $container)).to.contain('avacado')
      expect($('.velge-list', $container)).to.not.contain('carrot')
      expect($('.velge-list', $container)).to.not.contain('apple')

  describe '#remChoice', ->
    beforeEach ->
      velge = new Velge($container, choices: [{ name: 'apple' }]).setup()

    it 'removes the choice', ->
      velge.remChoice(name: 'apple')

      expect($('.velge-dropdown', $container)).to.not.contain('apple')

  describe '#remChosen', ->
    beforeEach ->
      velge = new Velge($container, chosen: [{ name: 'apple' }]).setup()

    it 'removes the chosen status, returning it to the list of choices', ->
      velge.remChosen(name: 'apple')

      expect($('.velge-list', $container)).to.not.contain('apple')
      expect($('.velge-dropdown', $container)).to.contain('apple')

  describe '#onAdd', ->
    beforeEach ->
      velge = new Velge($container).setup()

    it 'returns itself for chaining', ->
      expect(velge.onAdd()).to.be(velge)

    it 'performs all callbacks when choices are added', ->
      spyA = sinon.spy()
      spyB = sinon.spy()

      velge
        .onAdd(spyA)
        .onAdd(spyB)

      velge.addChosen(name: 'persimon')

      expect(spyA.called).to.be.true
      expect(spyB.called).to.be.true
      expect(spyA.calledWith({ chosen: true, name: 'persimon' }, velge)).to.be.true
      expect(spyB.calledWith({ chosen: true, name: 'persimon' }, velge)).to.be.true

    it 'calls within the supplied context when given', ->
      context = new Object()
      spy = sinon.spy()

      velge.onAdd(spy, context)
      velge.addChosen(name: 'persimon')

      expect(spy.calledOn(context)).to.be.true

  describe '#onRem', ->
    beforeEach ->
      velge = new Velge($container, chosen: [
        { name: 'persimon' }
      ]).setup()

    it 'returns itself for chaining', ->
      expect(velge.onRem()).to.be(velge)

    it 'performs all callbacks when choices are added', ->
      spyA = sinon.spy()
      spyB = sinon.spy()

      velge
        .onRem(spyA)
        .onRem(spyB)

      velge.remChosen(name: 'persimon')

      expect(spyA.called).to.be.true
      expect(spyB.called).to.be.true

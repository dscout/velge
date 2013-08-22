describe 'Velge', ->
  velge      = null
  $container = null
  template   = '<div class="container"></div>'

  beforeEach ->
    $container = $(template).appendTo($('#sandbox'))

  afterEach ->
    $('#sandbox').empty()

  describe '#inject', ->
    it 'returns the instance for chaining', ->
      velge = new Velge($container)

      expect(velge.inject()).to.be(velge)

    it 'injects the velge structure into the container', ->
      velge = new Velge($container).inject()

      expect($container).to.have('.velge')
      expect($container).to.have('.velge-list')
      expect($container).to.have('.velge-input')
      expect($container).to.have('.velge-trigger')
      expect($container).to.have('.velge-dropdown')

  describe '#setup', ->
    it 'renders all provided tags', ->
      velge = new Velge($container, chosen: [
        { name: 'Apple' },
        { name: 'Melon' }
      ]).setup()

      expect($('.velge-list', $container)).to.contain('Apple')
      expect($('.velge-list', $container)).to.contain('Melon')

  describe '#addChoice', ->
    beforeEach ->
      velge = new Velge($container).inject()

    it 'preopulates the dropdown menu with supplied choices', ->
      velge.addChoice(name: 'Banana')

      expect($('.velge-dropdown', $container)).to.contain('Banana')

    it 'maintains choices in alphabetical order', ->
      velge
        .addChoice(name: 'Watermelon')
        .addChoice(name: 'Banana')
        .addChoice(name: 'Kiwi')

      expect($('.velge-dropdown li', $container).eq(0).text()).to.contain('Banana')
      expect($('.velge-dropdown li', $container).eq(1).text()).to.contain('Kiwi')
      expect($('.velge-dropdown li', $container).eq(2).text()).to.contain('Watermelon')

    it 'does not display duplicate choices', ->
      velge
        .addChoice(name: 'Fig')
        .addChoice(name: 'Fig')

      expect($('.velge-dropdown li', $container).length).to.eq(1)

    it 'does not display choices that have been chosen', ->
      velge
        .addChosen(name: 'Fig')
        .addChosen(name: 'Grape')
        .addChoice(name: 'Fig')
        .addChoice(name: 'Peach')

      expect($('.velge-dropdown', $container)).to.not.contain('Fig')

  describe '#addChosen', ->
    beforeEach ->
      velge = new Velge($container).inject()

    it 'populates the chosen list with supplied tags', ->
      velge.addChosen(name: 'Apple')

      expect($('.velge-list', $container)).to.contain('Apple')

    it 'moves any existing choices to the chosen list', ->
      velge
        .addChoice(name: 'Apple')
        .addChosen(name: 'Apple')

      expect($('.velge-list',     $container)).to.contain('Apple')
      expect($('.velge-dropdown', $container)).to.not.contain('Apple')

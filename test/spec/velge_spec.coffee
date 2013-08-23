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

describe 'Velge', ->
  press = ($input, name) ->
    key = switch name
      when 'backspace' then 8
      when 'tab'       then 9
      when 'enter'     then 13
      when 'escape'    then 27
      when 'space'     then 32
      when 'up'        then 38
      when 'down'      then 40
      when ','         then 188

    $input.trigger($.Event('keydown', { which: key }))

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

    it 'injects the velge structure into the container', ->
      velge = new Velge($container).setup()

      expect($container).to.have('.velge')
      expect($container).to.have('.velge-list')
      expect($container).to.have('.velge-input')
      expect($container).to.have('.velge-trigger')
      expect($container).to.have('.velge-dropdown')

  describe '#setup', ->
    it 'renders all provided choices', ->
      velge = new Velge($container,
        chosen:  [{ name: 'Apple' }, { name: 'Melon' }]
        choices: [{ name: 'Banana' }]
      ).setup()

      expect($('.velge-list', $container)).to.contain('Apple')
      expect($('.velge-list', $container)).to.contain('Melon')
      expect($('.velge-dropdown', $container)).to.contain('Banana')

  describe '#addChoice', ->
    beforeEach ->
      velge = new Velge($container).setup()

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
      velge = new Velge($container).setup()

    it 'populates the chosen list with supplied tags', ->
      velge.addChosen(name: 'Apple')

      expect($('.velge-list', $container)).to.contain('Apple')

  describe '#remChoice', ->
    beforeEach ->
      velge = new Velge($container, choices: [{ name: 'Apple' }]).setup()

    it 'removes the choice', ->
      velge.remChoice(name: 'Apple')

      expect($('.velge-dropdown', $container)).to.not.contain('Apple')

  describe '#remChosen', ->
    beforeEach ->
      velge = new Velge($container, chosen: [{ name: 'Apple' }]).setup()

    it 'removes the chosen status, returning it to the list of choices', ->
      velge.remChosen(name: 'Apple')

      expect($('.velge-list', $container)).to.not.contain('Apple')
      expect($('.velge-dropdown', $container)).to.contain('Apple')

  describe '$dropdown', ->
    beforeEach ->
      velge = new Velge($container, choices: [{ name: 'Apple' }]).setup()

    it 'opens the dropdown when down is pressed', ->
      $input    = $('.velge-input', $container)
      $dropdown = $('.velge-dropdown', $container)

      press($input, 'down')

      expect($dropdown).to.have.class('open')

    it 'opens the dropdown on trigger click', ->
      $trigger  = $('.velge-trigger', $container)
      $dropdown = $('.velge-dropdown', $container)

      $trigger.trigger('click')

      expect($dropdown).to.have.class('open')

    it 'does not open the dropdown when down is pressed', ->
      velge.remChoice(name: 'Apple')

      $input    = $('.velge-input', $container)
      $trigger  = $('.velge-trigger', $container)
      $dropdown = $('.velge-dropdown', $container)

      press($input, 'down')
      expect($dropdown).to.not.have.class('open')

      $trigger.trigger('click')
      expect($dropdown).to.not.have.class('open')

    it 'closes the dropdown on input blur', ->
      $dropdown = $('.velge-dropdown', $container)
      $input    = $('.velge-input', $container)
      $trigger  = $('.velge-trigger', $container)

      $trigger.trigger('click')
      $input.trigger($.Event('blur'))

      expect($dropdown).to.not.have.class('open')

    it 'closes on escape', ->
      $dropdown = $('.velge-dropdown', $container)
      $input    = $('.velge-input', $container)
      $trigger  = $('.velge-trigger', $container)

      $trigger.trigger('click')
      press($input, 'escape')

      expect($dropdown).to.not.have.class('open')

  describe '$input', ->
    beforeEach ->
      velge = new Velge($container, chosen: [{ name: 'Apple' }]).setup()

    it 'clears the input on escape', ->
      $input = $('.velge-input', $container)

      $input.val('apple')
      press($input, 'escape')

      expect($input).to.have.value('')

  describe 'highlighting', ->
    $dropdown = null
    $trigger  = null
    $input    = null

    beforeEach ->
      velge = new Velge($container, choices: [
        { name: 'Apple'  },
        { name: 'Kiwi'   },
        { name: 'Orange' }
      ]).setup()

      $dropdown = $('.velge-dropdown', $container)
      $input    = $('.velge-input', $container)
      $trigger  = $('.velge-trigger', $container)

      $trigger.trigger('click')

    it 'does not highlight anything when the dropdown is opened', ->
      expect($dropdown).to.not.have('.highlighted')

    it 'cycles the highlight down through choices', ->
      press($input, 'down')
      expect($('.highlighted', $dropdown)).to.have.text('Apple')

      press($input, 'down')
      expect($('.highlighted', $dropdown)).to.have.text('Kiwi')

    it 'cycles the highlight up through choices', ->
      press($input, 'up')
      expect($('.highlighted', $dropdown)).to.have.text('Kiwi')

      press($input, 'up')
      expect($('.highlighted', $dropdown)).to.have.text('Apple')

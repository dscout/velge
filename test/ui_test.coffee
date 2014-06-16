describe 'Velge.UI', ->
  press = ($input, name) ->
    key = switch name
      when 'backspace' then 8
      when 'tab'       then 9
      when 'enter'     then 13
      when 'escape'    then 27
      when 'space'     then 32
      when 'up'        then 38
      when 'down'      then 40
      when 'left'      then 37
      when 'right'     then 39
      when ','         then 188

    $input.trigger($.Event('keydown', { which: key }))

  velge      = null
  $container = null
  $dropdown  = null
  $input     = null
  $list      = null
  $trigger   = null
  template   = '<div class="container"></div>'

  beforeEach ->
    $container = $(template).appendTo($('#sandbox'))

  afterEach ->
    $('#sandbox').empty()

  describe '#render', ->
    it 'injects the velge structure into the container', ->
      velge = new Velge($container).setup()

      expect($container).to.have('.velge')
      expect($container).to.have('.velge-list')
      expect($container).to.have('.velge-input')
      expect($container).to.have('.velge-trigger')
      expect($container).to.have('.velge-dropdown')

    it 'applies the placeholder option', ->
      velge = new Velge($container, placeholder: 'Choose').setup()

      expect($('.velge-input', $container).attr('placeholder')).to.eq('Choose')

  describe 'choice dropdown', ->
    beforeEach ->
      velge = new Velge($container, choices: [{ name: 'apple' }]).setup()

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
      velge.remChoice(name: 'apple')

      $input    = $('.velge-input', $container)
      $trigger  = $('.velge-trigger', $container)
      $dropdown = $('.velge-dropdown', $container)

      press($input, 'down')
      expect($dropdown).to.not.have.class('open')

      $trigger.trigger('click')
      expect($dropdown).to.not.have.class('open')

    it 'closes the dropdown on input blur', (done) ->
      @slow(300)

      $dropdown = $('.velge-dropdown', $container)
      $input    = $('.velge-input', $container)
      $trigger  = $('.velge-trigger', $container)

      $trigger.trigger('click')
      $input.trigger($.Event('blur'))

      setTimeout((->
        expect($dropdown).to.not.have.class('open')
        done()
      ), 200)

    it 'closes on escape', ->
      $dropdown = $('.velge-dropdown', $container)
      $input    = $('.velge-input', $container)
      $trigger  = $('.velge-trigger', $container)

      $trigger.trigger('click')
      press($input, 'escape')

      expect($dropdown).to.not.have.class('open')

  describe 'clearing input', ->
    beforeEach ->
      velge = new Velge($container, chosen: [{ name: 'apple' }]).setup()

    it 'clears the input on escape', ->
      $input = $('.velge-input', $container)

      $input.val('apple')
      press($input, 'escape')

      expect($input).to.have.value('')

  describe 'highlighting', ->
    beforeEach ->
      velge = new Velge($container, choices: [
        { name: 'apple'  },
        { name: 'kiwi'   },
        { name: 'orange' }
      ]).setup()

      $dropdown = $('.velge-dropdown', $container)
      $input    = $('.velge-input', $container)
      $trigger  = $('.velge-trigger', $container)

      $trigger.trigger('click')

    it 'does not highlight anything when the dropdown is opened', ->
      expect($dropdown).to.not.have('.highlighted')

    it 'cycles the highlight down through choices', ->
      press($input, 'down')
      expect($('.highlighted', $dropdown)).to.have.text('apple')

      press($input, 'down')
      expect($('.highlighted', $dropdown)).to.have.text('kiwi')

    it 'cycles the highlight down through choices', ->
      press($input, 'tab')
      expect($('.highlighted', $dropdown)).to.have.text('apple')

      press($input, 'tab')
      expect($('.highlighted', $dropdown)).to.have.text('kiwi')

    it 'cycles the highlight up through choices', ->
      press($input, 'up')
      expect($('.highlighted', $dropdown)).to.have.text('kiwi')

      press($input, 'up')
      expect($('.highlighted', $dropdown)).to.have.text('apple')

  describe 'choice selection', ->
    beforeEach ->
      velge = new Velge($container, choices: [
        { name: 'apple'  },
        { name: 'kiwi'   },
        { name: 'orange' }
      ]).setup()

      $('.velge-trigger', $container).trigger('click')

    it 'clicking marks a choice as chosen', ->
      $dropdown = $('.velge-dropdown', $container)
      $list = $('.velge-list', $container)

      $('li:contains(kiwi)', $container).click()

      expect($dropdown).to.not.contain('kiwi')
      expect($list).to.contain('kiwi')
      expect($dropdown).to.not.have.class('open')

  describe 'choice matching', ->
    beforeEach ->
      velge = new Velge($container,
        chosen: [
          { name: 'aplomb' }
        ],
        choices: [
          { name: 'apple'   },
          { name: 'apricot' },
          { name: 'orange'  }
        ]
      ).setup()

      $input = $('.velge-input', $container)

    it 'filters down choices on input', (done) ->
      $input.val('ap')
      press($input, 'space')

      setTimeout((->
        expect($('.velge-dropdown li:visible').length).to.eq(2)
        done()
      ), 11)

    it 'emphasizes the matched characters in each choice', (done) ->
      $input.val('ap')
      press($input, 'space')

      setTimeout((->
        $matches = $('.velge-dropdown li:visible')
        expect($matches.eq(0)).to.have.html('<b>ap</b>ple')
        expect($matches.eq(1)).to.have.html('<b>ap</b>ricot')
        done()
      ), 11)

  describe 'removing chosen', ->
    beforeEach ->
      velge = new Velge($container, chosen: [
        { name: 'apple'   }
        { name: 'apricot' }
        { name: 'orange'  }
      ]).setup()

    it 'removes the choice from the chosen list when remove is clicked', ->
      $list = $('.velge-list', $container)
      $dropdown = $('.velge-dropdown', $container)

      $('li:contains(apple) .remove', $list).click()

      expect($list).to.not.contain('apple')
      expect($dropdown).to.contain('apple')

    it 'highlights and then removes the last choice via backspace', ->
      $input = $('.velge-input', $container)
      $list  = $('.velge-list', $container)

      press($input, 'backspace')

      expect($list).to.have('.highlighted')
      expect($('.highlighted', $list)).to.contain('orange')

      press($input, 'backspace')
      expect($list).to.not.have('.highlighted')
      expect($list).to.not.contain('orange')

    it 'cycles highlighting through chosen', ->
      $input = $('.velge-input', $container)
      $list  = $('.velge-list', $container)

      press($input, 'left')
      expect($list).to.have('.highlighted')
      expect($('.highlighted', $list)).to.contain('orange')

      press($input, 'left')
      expect($('.highlighted', $list)).to.contain('apricot')

      press($input, 'right')
      expect($('.highlighted', $list)).to.contain('orange')

  describe 'choice selection', ->
    beforeEach ->
      velge = new Velge($container, choices: [
        { name: 'apple'   }
        { name: 'apricot' }
        { name: 'orange'  }
      ]).setup()

      $input = $('.velge-input', $container)
      $list  = $('.velge-list', $container)

    it 'does not add blank input', ->
      $input.val('')
      press($input, 'enter')

      expect($('li', $list).length).to.eq(0)

    it 'adds choices on "enter"', ->
      $input.val('plum')
      press($input, 'enter')

      expect($list).to.contain('plum')

    it 'adds choices on "comma"', ->
      $input.val('plum')
      press($input, ',')

      expect($list).to.contain('plum')

    it 'clears the input', ->
      $input.val('plum')
      press($input, 'enter')

      expect($input).to.have.value('')

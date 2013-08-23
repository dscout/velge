class Velge.UI
  KEYCODES:
    TAB:    9
    ENTER:  13
    ESCAPE: 27
    LEFT:   37
    UP:     38
    RIGHT:  39
    DOWN:   40
    COMMA:  188

  wrapTemplate: """
    <div class='velge'>
      <ul class='velge-list'></ul>
      <input type='text' autocomplete='off' placeholder='Add Tags' class='velge-input placeholder' />
      <span class='velge-trigger'></span>
      <ol class='velge-dropdown'></ol>
    </div>
  """

  chosenTemplate: """
    <li>
      <span class='name'>{{name}}</span>
      <span class='remove'>&times;</span>
    </li>
  """

  choiceTemplate: """
    <li>{{name}}</li>
  """

  constructor: ($container, velge, store) ->
    @$container = $container
    @velge      = velge
    @store      = store
    @index      = -1

  setup: ->
    @render()
    @bindDomEvents()
    @renderChoices()
    @renderChosen()

    @

  bindDomEvents: ->
    keycodes = @KEYCODES
    self     = @

    @$wrapper.on 'keydown.velge', '.velge-input', (event) ->
      switch event.which
        when keycodes.ESCAPE
          self.closeDropdown()
          self.$input.val('')
        when keycodes.DOWN
          self.openDropdown()
          self.cycle('down')
          self.renderHighlighted()
        when keycodes.UP
          self.openDropdown()
          self.cycle('up')
          self.renderHighlighted()
        else
          callback = ->
            self.index = -1
            self.filterChoices(self.$input.val())
          setTimeout(callback, 10)
          self.openDropdown()

    @$wrapper.on 'click.velge', '.velge-list .remove', (event) ->
      $target = $(event.currentTarget).parent().find('.name')
      self.unchoose($target.text())
      self.renderChoices()
      self.renderChosen()

    @$wrapper.on 'blur.velge', '.velge-input', (event) ->
      clearTimeout(self.closeTimeout)

      callback = ->
        self.closeDropdown()
        self.blurInput()

      self.closeTimeout = setTimeout(callback, 75)

    @$wrapper.on 'click.velge', '.velge-trigger', (event) ->
      clearTimeout(self.closeTimeout)
      self.toggleDropdown()

    @$wrapper.on 'click.velge', '.velge-dropdown li', (event) ->
      $target = $(event.currentTarget)
      self.choose($target.text())
      self.renderChoices()
      self.renderChosen()
      self.closeDropdown()

  choose: (name) ->
    @store.update({ name: name }, { chosen: true })

  unchoose: (name) ->
    @store.update({ name: name }, { chosen: false })

  render: ->
    @$wrapper  = $(@wrapTemplate)
    @$list     = $('.velge-list',     @$wrapper)
    @$input    = $('.velge-input',    @$wrapper)
    @$dropdown = $('.velge-dropdown', @$wrapper)

    @$container.append(@$wrapper)

  renderChosen: ->
    choices = for choice in @store.filter(chosen: true)
      @chosenTemplate.replace('{{name}}', choice.name)

    @$list.empty().html(choices)

  renderChoices: (filtered) ->
    filtered ||= @store.filter(chosen: false)

    choices = for choice in filtered
      @choiceTemplate.replace('{{name}}', choice.name)

    @$dropdown.empty().html(choices)

  renderHighlighted: ->
    selected = @index

    for li, index in @$dropdown.find('li')
      $(li).toggleClass 'highlighted', index is selected

  openDropdown: ->
    @$dropdown.addClass('open') unless @store.isEmpty()

  closeDropdown: ->
    @$dropdown.removeClass('open')

  toggleDropdown: ->
    if @$dropdown.hasClass('open')
      @closeDropdown()
    else
      @openDropdown()

  blurInput: ->
    @$input.val('')

  filterChoices: (value) ->
    matching = @store.fuzzy(value)

    @renderChoices(matching)

    @$dropdown.toggleClass('open', matching.length isnt 0)

  cycle: (direction = 'down') ->
    length = @$dropdown.find('li').length

    if length > 0
      @index = if direction is 'down'
        (@index + 1) % length
      else
        (@index + (length - 1)) % length
    else
      @index = -1

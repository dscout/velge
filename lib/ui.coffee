class Velge.UI
  KEYCODES:
    BACKSPACE: 8
    TAB:       9
    ENTER:     13
    ESCAPE:    27
    LEFT:      37
    UP:        38
    RIGHT:     39
    DOWN:      40
    COMMA:     188

  wrapTemplate: """
    <div class='velge'>
      <div class='velge-inner'>
        <ul class='velge-list'></ul>
        <input type='text' autocomplete='off' placeholder='{{placeholder}}' class='velge-input' />
        <span class='velge-trigger'></span>
      </div>
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

  defaults:
    placeholder: 'Add Tag'

  constructor: ($container, velge, store, options = {}) ->
    @$container  = $container
    @velge       = velge
    @store       = store
    @choiceIndex = -1
    @chosenIndex = -1

    @options = Velge.Util.defaults(options, @defaults)

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
      callback = ->
        self.choiceIndex = -1
        self.filterChoices(self.$input.val())

      switch event.which
        when keycodes.ESCAPE
          event.stopPropagation()
          self.blurInput()
          self.closeDropdown()
          self.renderHighlightedChosen()
          self.renderChoices()
          self.clearInput()
        when keycodes.COMMA, keycodes.ENTER
          event.preventDefault()
          self.submit(self.$input.val())
          self.clearInput()
          self.closeDropdown()
        when keycodes.DOWN, keycodes.TAB
          event.preventDefault()
          self.openDropdown()
          self.cycleChoice('down')
          self.renderHighlightedChoice()
          self.autoComplete()
        when keycodes.UP
          event.preventDefault()
          self.openDropdown()
          self.cycleChoice('up')
          self.renderHighlightedChoice()
          self.autoComplete()
        when keycodes.LEFT
          event.stopPropagation()
          if self.$input.val() is ''
            self.chosenIndex = 0 if self.chosenIndex is -1
            self.cycleChosen('up')
            self.renderHighlightedChosen()
        when keycodes.RIGHT
          event.stopPropagation()
          if self.$input.val() is ''
            self.chosenIndex = 0 if self.chosenIndex is -1
            self.cycleChosen('down')
            self.renderHighlightedChosen()
        when keycodes.BACKSPACE
          if self.$input.val() is ''
            if self.chosenIndex > -1
              self.removeHighlightedChosen()
            else
              self.chosenIndex = 0
              self.cycleChosen('up')
              self.renderHighlightedChosen()
          else
            setTimeout(callback, 10)
        else
          setTimeout(callback, 10)

    @$wrapper.on 'blur.velge', '.velge-input', (event) ->
      clearTimeout(self.closeTimeout)

      callback = ->
        self.closeDropdown()
        self.clearInput()

      self.closeTimeout = setTimeout(callback, 75)

    @$wrapper.on 'click.velge', ->
      self.$input.focus() unless self.$input.is(':focus')
      false

    @$wrapper.on 'click.velge', '.velge-list .remove', (event) ->
      $target = $(event.currentTarget).parent().find('.name')
      self.velge.remChosen(name: $target.text())
      false

    @$wrapper.on 'click.velge', '.velge-trigger', (event) ->
      clearTimeout(self.closeTimeout)
      self.toggleDropdown()
      false

    @$wrapper.on 'click.velge', '.velge-dropdown li', (event) ->
      $target = $(event.currentTarget)
      self.submit($target.text())
      self.renderChoices()
      self.renderChosen()
      self.closeDropdown()
      false

  submit: (name) ->
    return false unless @store.isValid(name)

    @velge.addChosen(name: name)

  render: ->
    @$wrapper  = $(Velge.Util.template(@wrapTemplate, @options))
    @$inner    = $('.velge-inner',    @$wrapper)
    @$list     = $('.velge-list',     @$wrapper)
    @$input    = $('.velge-input',    @$wrapper)
    @$dropdown = $('.velge-dropdown', @$wrapper)

    @$container.append(@$wrapper)

  renderChosen: ->
    choices = for choice in @store.filter(chosen: true)
      Velge.Util.template(@chosenTemplate, name: choice.name)

    @$list.html(choices)

  renderChoices: (filtered, value) ->
    filtered ||= @store.filter(chosen: false)

    choices = for choice in filtered
      Velge.Util.template(@choiceTemplate, name: Velge.Util.emphasize(choice.name, value))

    @$dropdown.html(choices)

  renderHighlightedChoice: ->
    selected = @choiceIndex

    for li, index in @$dropdown.find('li')
      $choice = $(li)
      $choice.toggleClass 'highlighted', index is selected
      Velge.Util.autoScroll($choice, @$dropdown) if index is selected

  renderHighlightedChosen: ->
    selected = @chosenIndex

    for li, index in @$list.find('li')
      $(li).toggleClass 'highlighted', index is selected

  removeHighlightedChosen: ->
    $target = @$list.find('.highlighted .name')
    @velge.remChosen(name: $target.text())
    @positionDropdown()
    @chosenIndex = -1

  cycleChoice: (direction) ->
    length = @$dropdown.find('li').length
    @choiceIndex = Velge.Util.cycle(@choiceIndex, length, direction)

  cycleChosen: (direction) ->
    length = @$list.find('li').length
    @chosenIndex = Velge.Util.cycle(@chosenIndex, length, direction)

  openDropdown: ->
    unless @store.isEmpty()
      @positionDropdown()
      @$dropdown.addClass('open')

  positionDropdown: (offset = 13) ->
    @$dropdown.css(top: @$inner.outerHeight() + offset)

  closeDropdown: ->
    @$dropdown.removeClass('open')
    @choiceIndex = -1
    @chosenIndex = -1

  toggleDropdown: ->
    if @$dropdown.hasClass('open')
      @closeDropdown()
    else
      @openDropdown()

  blurInput: ->
    if @$input.val() is '' and @choiceIndex is -1 and @chosenIndex is -1
      @$input.blur()

  clearInput: ->
    @$input.val('')

  filterChoices: (value) ->
    matching = @store.fuzzy(value)

    @renderChoices(matching, value)

    if matching.length isnt 0
      @openDropdown()
    else
      @closeDropdown()

  autoComplete: ->
    $highlighted = @$dropdown.find('.highlighted')

    @$input.val($highlighted.text())

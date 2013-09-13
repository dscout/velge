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
      <ul class='velge-list'></ul>
      <input type='text' autocomplete='off' placeholder='{{placeholder}}' class='velge-input' />
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

  defaults:
    placeholder: 'Add Tag'

  constructor: ($container, velge, store, options = {}) ->
    @$container  = $container
    @velge       = velge
    @store       = store
    @choiceIndex = -1
    @chosenIndex = -1

    @options = @_defaults(options, @defaults)

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
        when keycodes.BACKSPACE
          break unless self.$input.val() is ''

          if self.chosenIndex > -1
            self.removeHighlightedChosen()
          else
            self.chosenIndex = 0
            self.cycleChosen('up')
            self.renderHighlightedChosen()
        when keycodes.ESCAPE
          self.closeDropdown()
          self.renderHighlightedChosen()
          self.$input.val('')
        when keycodes.COMMA, keycodes.ENTER, keycodes.TAB
          event.preventDefault()
          self.submit(self.$input.val())
          self.blurInput()
          self.closeDropdown()
        when keycodes.DOWN
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
        else
          callback = ->
            self.choiceIndex = -1
            self.filterChoices(self.$input.val())
          setTimeout(callback, 10)

    @$wrapper.on 'blur.velge', '.velge-input', (event) ->
      clearTimeout(self.closeTimeout)

      callback = ->
        self.closeDropdown()
        self.blurInput()

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
    return false unless @store.validate(name)

    @velge.addChosen(name: name)

  render: ->
    @$wrapper  = $(@_template(@wrapTemplate, @options))
    @$list     = $('.velge-list',     @$wrapper)
    @$input    = $('.velge-input',    @$wrapper)
    @$dropdown = $('.velge-dropdown', @$wrapper)

    @$container.append(@$wrapper)

  renderChosen: ->
    choices = for choice in @store.filter(chosen: true)
      @_template(@chosenTemplate, name: choice.name)

    @$list.html(choices)

  renderChoices: (filtered, value) ->
    filtered ||= @store.filter(chosen: false)

    choices = for choice in filtered
      @_template(@choiceTemplate, name: @_emphasize(choice.name, value))

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
    @chosenIndex = -1

  cycleChoice: (direction) ->
    length = @$dropdown.find('li').length
    @choiceIndex = @_cycle(@choiceIndex, length, direction)

  cycleChosen: (direction) ->
    length = @$list.find('li').length
    @chosenIndex = @_cycle(@chosenIndex, length, direction)

  openDropdown: ->
    @$dropdown.addClass('open') unless @store.isEmpty()

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
    @$input.val('')

  filterChoices: (value) ->
    matching = @store.fuzzy(value)

    @renderChoices(matching, value)

    @$dropdown.toggleClass('open', matching.length isnt 0)

  autoComplete: ->
    $highlighted = @$dropdown.find('.highlighted')

    @$input.val($highlighted.text())

  _cycle: (index, length, direction = 'down') ->
    if length > 0
      if direction is 'down'
        (index + 1) % length
      else
        (index + (length - 1)) % length
    else
      -1

  _defaults: (options, defaults) ->
    for key, value of defaults
      options[key] = defaults[key] unless options[key]?

    options

  _template: (string, object) ->
    buffer = string
    buffer = buffer.replace("{{#{key}}}", value) for key, value of object
    buffer

  _emphasize: (string, value) ->
    if value? and value.length > 0
      string.replace(new RegExp("(#{value})", 'i'), "<b>$1</b>")
    else
      string

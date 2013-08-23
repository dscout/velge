class window.Velge
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
      <b>{{name}}</b>
      <i>&times;</i>
    </li>
  """

  choiceTemplate: """
    <li>{{name}}</li>
  """

  constructor: ($container, options = {}) ->
    @$container = $container
    @store      = new Velge.Store()
    @selected   = -1

    @_preloadChoices(options.chosen  || [], true)
    @_preloadChoices(options.choices || [], false)

  setup: ->
    @_inject()
    @_renderChoices()
    @_renderChosen()
    @_bindDomEvents()

    @

  addChosen: (choice) ->
    @store.push(choice, true)
    @_renderChosen()
    @

  addChoice: (choice) ->
    @store.push(choice)
    @_renderChoices()
    @

  remChoice: (choice) ->
    @store.delete(choice)
    @_renderChoices()
    @

  remChosen: (choice) ->
    @store.update(choice, chosen: false)
    @_renderChosen()
    @_renderChoices()
    @

  _inject: ->
    @$wrapper  = $(@wrapTemplate)
    @$list     = $('.velge-list', @$wrapper)
    @$input    = $('.velge-input', @$wrapper)
    @$dropdown = $('.velge-dropdown', @$wrapper)

    @$container.append(@$wrapper)

    @

  _bindDomEvents: ->
    keycodes = @KEYCODES
    self     = @

    @$wrapper.on 'keydown.velge', '.velge-input', (event) ->
      switch event.which
        when keycodes.ESCAPE
          self._closeDropdown()
          self.$input.val('')
        when keycodes.DOWN
          self._openDropdown()
          self.store.cycle('down')
          self._renderHighlighted()
        when keycodes.UP
          self._openDropdown()
          self.store.cycle('up')
          self._renderHighlighted()

    @$wrapper.on 'blur.velge', '.velge-input', (event) ->
      self._closeDropdown()

    @$wrapper.on 'click.velge', '.velge-trigger', (event) ->
      self._openDropdown()

  _renderChosen: ->
    choices = for choice in @store.filter(true)
      @chosenTemplate.replace('{{name}}', choice.name)

    @$list.empty().html(choices)

  _renderChoices: ->
    choices = for choice in @store.filter(false)
      @choiceTemplate.replace('{{name}}', choice.name)

    @$dropdown.empty().html(choices)

  _renderHighlighted: ->
    selected = @store.index

    for li, index in @$dropdown.find('li')
      $(li).toggleClass 'highlighted', index is selected

  _preloadChoices: (choices, isChosen) ->
    @store.push(choice, isChosen) for choice in choices

  _openDropdown: ->
    @$dropdown.addClass('open') unless @store.isEmpty()

  _closeDropdown: ->
    @$dropdown.removeClass('open')

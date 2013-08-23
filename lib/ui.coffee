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
      <b>{{name}}</b>
      <i>&times;</i>
    </li>
  """

  choiceTemplate: """
    <li>{{name}}</li>
  """

  constructor: ($container, velge, store) ->
    @$container = $container
    @velge      = velge
    @store      = store

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
          self.store.cycle('down')
          self.renderHighlighted()
        when keycodes.UP
          self.openDropdown()
          self.store.cycle('up')
          self.renderHighlighted()

    @$wrapper.on 'blur.velge', '.velge-input', (event) ->
      clearTimeout(self.closeTimeout)

      callback = ->
        self.closeDropdown()
        self.blurInput()

      self.closeTimeout = setTimeout(callback, 75)

    @$wrapper.on 'click.velge', '.velge-trigger', (event) ->
      self.openDropdown()

    @$wrapper.on 'click.velge', '.velge-dropdown li', (event) ->
      $target = $(event.currentTarget)
      self.choose($target.text())
      self.renderChoices()
      self.renderChosen()
      self.closeDropdown()

  choose: (name) ->
    @store.update({ name: name }, { chosen: true })

  render: ->
    @$wrapper  = $(@wrapTemplate)
    @$list     = $('.velge-list',     @$wrapper)
    @$input    = $('.velge-input',    @$wrapper)
    @$dropdown = $('.velge-dropdown', @$wrapper)

    @$container.append(@$wrapper)

  renderChosen: ->
    choices = for choice in @store.filter(true)
      @chosenTemplate.replace('{{name}}', choice.name)

    @$list.empty().html(choices)

  renderChoices: ->
    choices = for choice in @store.filter(false)
      @choiceTemplate.replace('{{name}}', choice.name)

    @$dropdown.empty().html(choices)

  renderHighlighted: ->
    selected = @store.index

    for li, index in @$dropdown.find('li')
      $(li).toggleClass 'highlighted', index is selected

  openDropdown: ->
    @$dropdown.addClass('open') unless @store.isEmpty()

  closeDropdown: ->
    @$dropdown.removeClass('open')

  blurInput: ->
    @$input.blur()

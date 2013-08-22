class window.Velge
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

  # Construct Velge with a jQuery `container` and `options`.
  constructor: ($container, options = {}) ->
    @$container = $container
    @chosen    = options.chosen || []

    @_choices   = []
    @_choiceMap = {}

  setup: ->
    @inject()

    @addChosen(chosen) for chosen in @chosen

  inject: ->
    @$wrapper  = $(@wrapTemplate)
    @$list     = $('.velge-list', @$wrapper)
    @$dropdown = $('.velge-dropdown', @$wrapper)

    @$container.append(@$wrapper)

    @

  addChosen: (choice) ->
    @_push(choice, true)
    @_renderChosen()
    @

  addChoice: (choice) ->
    @_push(choice)
    @_renderChoices()
    @

  _renderChosen: ->
    choices = for choice in @_choices when choice.chosen
      @chosenTemplate.replace('{{name}}', choice.name)

    @$list.empty().html(choices)

  _renderChoices: ->
    choices = for choice in @_choices when !choice.chosen
      @choiceTemplate.replace('{{name}}', choice.name)

    @$dropdown.empty().html(choices)

  _push: (choice, isChosen = false) ->
    choice.chosen = isChosen

    unless @_choiceMap[choice.name]?
      @_choices.push(choice)
      @_choiceMap[choice.name] = choice

      @_choices = @_choices.sort (a, b) ->
        if a.name > b.name then 1 else -1

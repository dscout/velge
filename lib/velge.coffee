class window.Velge
  constructor: ($container, options = {}) ->
    @store = new Velge.Store()
    @ui    = new Velge.UI($container, @, @store)

    @_preloadChoices(options.chosen  || [], true)
    @_preloadChoices(options.choices || [], false)

  setup: ->
    @ui.setup()

    @

  addChosen: (choice) ->
    @store.push(choice, true)
    @ui.renderChosen()
    @

  addChoice: (choice) ->
    @store.push(choice)
    @ui.renderChoices()
    @

  remChoice: (choice) ->
    @store.delete(choice)
    @ui.renderChoices()
    @

  remChosen: (choice) ->
    @store.update(choice, chosen: false)
    @ui.renderChosen()
    @ui.renderChoices()
    @

  _preloadChoices: (choices, isChosen) ->
    @store.push(choice, isChosen) for choice in choices

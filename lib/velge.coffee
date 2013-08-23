class window.Velge
  constructor: ($container, options = {}) ->
    @store = new Velge.Store()
    @ui    = new Velge.UI($container, @, @store)

    @addCallbacks = []
    @remCallbacks = []

    @_preloadChoices(options.chosen  || [], true)
    @_preloadChoices(options.choices || [], false)

  setup: ->
    @ui.setup()

    @

  addChosen: (choice) ->
    choice.chosen = true
    @store.push(choice)
    @ui.renderChosen()
    @ui.renderChoices()
    @_applyCallbacks(choice, @addCallbacks)
    @

  addChoice: (choice) ->
    @store.push(choice)
    @ui.renderChoices()
    @

  remChosen: (choice) ->
    @store.update(choice, chosen: false)
    @ui.renderChosen()
    @ui.renderChoices()
    @_applyCallbacks(choice, @remCallbacks)
    @

  remChoice: (choice) ->
    @store.delete(choice)
    @ui.renderChoices()
    @

  onAdd: (callback) ->
    @addCallbacks.push(callback)
    @

  onRem: (callback) ->
    @remCallbacks.push(callback)
    @

  _preloadChoices: (choices, isChosen) ->
    for choice in choices
      choice.chosen = isChosen
      @store.push(choice)

  _applyCallbacks: (choice, callbacks) ->
    callback.call(choice, @) for callback in callbacks

class window.Velge
  constructor: ($container, @options = {}) ->
    @store = new Velge.Store()
    @ui    = new Velge.UI($container, @, @store)

    @addCallbacks = []
    @remCallbacks = []

    @_preloadChoices(@options.chosen  || [], true)
    @_preloadChoices(@options.choices || [], false)

  setup: ->
    @ui.setup()

    @

  setOptions: (newOptions) ->
    @options[key] = value for key, value of newOptions

  addChoice: (choice) ->
    @store.push(choice)
    @ui.renderChoices()
    @

  remChoice: (choice) ->
    @store.delete(choice)
    @ui.renderChoices()
    @

  addChosen: (choice) ->
    @_enforceSingleChoice()
    chosen = @store.find(choice) || choice
    chosen.chosen = true
    @store.push(chosen)
    @ui.renderChosen()
    @ui.renderChoices()
    @_applyCallbacks(chosen, @addCallbacks)
    @

  remChosen: (choice) ->
    @store.update(choice, chosen: false)
    @ui.renderChosen()
    @ui.renderChoices()
    @_applyCallbacks(choice, @remCallbacks)
    @

  onAdd: (callback) ->
    @addCallbacks.push(callback)
    @

  onRem: (callback) ->
    @remCallbacks.push(callback)
    @

  _enforceSingleChoice: ->
    if @options.single?
      for choice in @store.choices()
        @store.update(choice, chosen: false)

  _preloadChoices: (choices, isChosen) ->
    for choice in choices
      choice.chosen = isChosen
      @store.push(choice)

  _applyCallbacks: (choice, callbacks) ->
    callback.call(choice, @) for callback in callbacks
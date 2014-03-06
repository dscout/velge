class window.Velge
  @VERSION: '0.9.2'

  constructor: ($container, @options = {}) ->
    @store = new Velge.Store()
    @ui = new Velge.UI($container, @, @store, @options)

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

  getChoices: ->
    @store.choices()

  getChosen: ->
    @store.filter(chosen: true)

  onAdd: (callback, context) ->
    @addCallbacks.push(callback: callback, context: context)
    @

  onRem: (callback, context) ->
    @remCallbacks.push(callback: callback, context: context)
    @

  _enforceSingleChoice: ->
    if @options.single?
      for choice in @store.choices()
        @store.update(choice, chosen: false)

  _preloadChoices: (choices, isChosen) ->
    for choice in choices when choice?
      choice.chosen = isChosen
      @store.push(choice)

  _applyCallbacks: (choice, callbacks) ->
    for callObject in callbacks
      callback = callObject.callback
      context  = callObject.context || @

      callback.call(context, choice, @)

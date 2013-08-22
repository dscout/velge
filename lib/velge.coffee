class window.Velge
  class Store
    constructor: ->
      @arr = []
      @map = {}

    objects: ->
      @arr

    push: (choice, isChosen = false) ->
      choice.chosen = isChosen

      unless @find(choice)?
        @arr.push(choice)
        @map[choice.name] = choice

      @sort()

    delete: (toRemove) ->
      for choice, index in @arr
        if choice.name is toRemove.name
          @arr.splice(index, 1)
          break

      delete @map[toRemove.name]

    update: (toUpdate, values) ->
      choice = @find(toUpdate)

      choice[key] = value for key, value of values

    find: (toFind) ->
      @map[toFind.name]

    sort: ->
      @arr = @arr.sort (a, b) ->
        if a.name > b.name then 1 else -1

      @arr

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
    @store      = new Store()

    @_preloadChoices(options.chosen  || [], true)
    @_preloadChoices(options.choices || [], false)

  setup: ->
    @inject()
    @_renderChoices()
    @_renderChosen()

    @

  inject: ->
    @$wrapper  = $(@wrapTemplate)
    @$list     = $('.velge-list', @$wrapper)
    @$dropdown = $('.velge-dropdown', @$wrapper)

    @$container.append(@$wrapper)

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

  _renderChosen: ->
    choices = for choice in @store.objects() when choice.chosen
      @chosenTemplate.replace('{{name}}', choice.name)

    @$list.empty().html(choices)

  _renderChoices: ->
    choices = for choice in @store.objects() when !choice.chosen
      @choiceTemplate.replace('{{name}}', choice.name)

    @$dropdown.empty().html(choices)

  _preloadChoices: (choices, isChosen) ->
    @store.push(choice, isChosen) for choice in choices

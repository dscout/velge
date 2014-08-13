class Velge.Store
  defaults:
    autoSort: true

  constructor:(options={})->
    @arr = []
    @map = {}

    @options = Velge.Util.defaults(options, @defaults)

  choices: ->
    @arr

  isEmpty: ->
    @arr.length is 0

  isValid: (value) ->
    !/^\s*$/.test(value)

  push: (choice) ->
    choice.name = @_normalize(choice.name)
    choice.chosen ||= false

    unless @find(choice)?
      @arr.push(choice)
      @map[choice.name] = choice

    @_sort() if @options.autoSort

    @

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
    @map[@_normalize(toFind.name)]

  fuzzy: (value) ->
    value = @_sanitize(value)
    query = if (/^\s*$/.test(value)) then '.*' else value
    regex = RegExp(query, 'i')

    for choice in @arr when !choice.chosen and regex.test(choice.name)
      choice

  filter: ({chosen}) ->
    chosen ||= false

    choice for choice in @arr when choice.chosen is chosen

  _normalize: (value) ->
    String(value).toLowerCase().replace(/(^\s*|\s*$)/g, '')

  _sanitize: (value) ->
    value.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&")

  _sort: ->
    @arr.sort (a, b) ->
      if a.name > b.name then 1 else -1

class Velge.Store
  constructor: ->
    @arr    = []
    @map    = {}

  objects: ->
    @arr

  isEmpty: ->
    @arr.length is 0

  normalize: (value) ->
    String(value).toLowerCase().replace(/(^\s*|\s*$)/g, '')

  sanitize: (value) ->
    value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")

  push: (choice) ->
    choice.name = @normalize(choice.name)
    choice.chosen ||= false

    unless @find(choice)?
      @arr.push(choice)
      @map[choice.name] = choice

    @sort()

    @

  delete: (toRemove) ->
    for choice, index in @arr
      if choice.name is toRemove.name
        @arr.splice(index, 1)
        break

    delete @map[toRemove.name]

    @

  update: (toUpdate, values) ->
    choice = @find(toUpdate)

    choice[key] = value for key, value of values

  find: (toFind) ->
    @map[toFind.name]

  fuzzy: (value) ->
    value = @sanitize(value)
    query = if (/^\s*$/.test(value)) then '.*' else value
    regex = RegExp(query, 'i')

    choice for choice in @arr when regex.test(choice.name)

  filter: (options = {}) ->
    options.chosen ||= false

    choice for choice in @arr when choice.chosen is options.chosen

  sort: ->
    @arr = @arr.sort (a, b) ->
      if a.name > b.name then 1 else -1

    @arr

class Velge.Store
  constructor: ->
    @arr    = []
    @map    = {}
    @index  = -1

  objects: ->
    @arr

  normalize: (value) ->
    String(value).toLowerCase().replace(/(^\s*|\s*$)/g, '')

  push: (choice, isChosen = false) ->
    choice.chosen = isChosen
    choice.name   = @normalize(choice.name)

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

  length: (withChosen = false) ->
    if withChosen
      @arr.length
    else
      @filter(withChosen).length

  cycle: (direction = 'down') ->
    length = @length()

    @index = if direction is 'down'
      (@index + 1) % length
    else
      (@index + (length - 1)) % length

  selected: ->
    @filter(false)[@index]

  filter: (isChosen) ->
    choice for choice in @arr when choice.chosen is isChosen

  find: (toFind) ->
    @map[toFind.name]

  isEmpty: ->
    @arr.length is 0

  sort: ->
    @arr = @arr.sort (a, b) ->
      if a.name > b.name then 1 else -1

    @arr

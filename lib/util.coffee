Velge.Util = {
  # Logic borrowed from jquery.ui.menu.js
  autoScroll: ($element, $container, padding = 10) ->
    eHeight = $element.height()
    cHeight = $container.height()
    offset  = $element.offset().top - $container.offset().top
    scroll  = $container.scrollTop()
    baseTop = scroll + offset + padding

    if offset < 0
      $container.scrollTop(baseTop)
    else if offset + (eHeight > cHeight)
      $container.scrollTop(baseTop - cHeight + eHeight)

  cycle: (index, length, direction = 'down') ->
    if length > 0
      if direction is 'down'
        (index + 1) % length
      else
        (index + (length - 1)) % length
    else
      -1

  defaults: (options, defaults) ->
    for key, value of defaults
      options[key] = defaults[key] unless options[key]?

    options

  emphasize: (string, value) ->
    if value? and value.length > 0
      string.replace(new RegExp("(#{value})", 'i'), "<b>$1</b>")
    else
      string

  template: (string, object) ->
    buffer = string
    buffer = buffer.replace("{{#{key}}}", value) for key, value of object
    buffer
}

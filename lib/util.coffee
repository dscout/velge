class Velge.Util
  # Logic borrowed from jquery.ui.menu.js
  @autoScroll: ($element, $container, padding = 10) ->
    eHeight = $element.height()
    cHeight = $container.height()
    offset  = $element.offset().top - $container.offset().top
    scroll  = $container.scrollTop()
    baseTop = scroll + offset + padding

    if offset < 0
      $container.scrollTop(baseTop)
    else if offset + (eHeight > cHeight)
      $container.scrollTop(baseTop - cHeight + eHeight)

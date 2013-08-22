# Velge |CHooz|

1. verb - Pick out or select as being the most appropriate of two or more alternatives.
2. noun - Robust tag or label management widget

## Installation

I have no idea yet. Something with grunt? Bower? Just use the built file?

## Usage

Velge can be attached to any container. The structure isn't of any importance:

```html
<div class='velge'></div>
```

Initialize velge with a selector for the container and customization options:

```javascript
var $element = $('.velge')
  , options  = {}
  , velge    = new Velge($element, options)
```

### Loading Tags

All tag matching is performed locally. As such you must load in all possible
choices and an optional set of applied choices:

```javascript
velge.addApplied([
  { name: "Apple" },
  { name: "Juicy" }
])

velge.addChoices([
  { name: "Orange" },
  { name: "Berry" },
  { name: "Tangy" }
])
```

Tag objects can be anything that have a "name" property or method. Whatever
object is loaded is what will be passed to any callbacks.

It isn't always tidy to add choices and applied separately. For convenience they can
also be loaded during construction:

```javascript
new Velge($selector, { applied: [], choices: [] })
```

### Persisting

The velge instance exposes hooks for persisting changes after tags have been
added or removed:

```javascript
var addCallback = function(tag, velge) { /* Persist Me */ }
  , remCallback = function(tag, velge) { /* Destroy Me */ }

velge
  .onAdd(addCallback)
  .onRem(remCallback)
```

### Error Handling

Because velge displays all tag additions instantly it can easily fall out of
sync with the underlying collection. If, for example, an ajax request fails you
can rollback the addition:

```javascript
var addCallback = function(tag, velge) {
  $.ajax({
    data: tag,
    type: "POST",
    url:  "/api/resource/1/tags"
  }).fail(function(error) {
    velge.remove(tag);
  })
}
```

## License

MIT, see `LICENSE.txt` for details.

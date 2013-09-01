[![Build Status](https://travis-ci.org/dscout/velge.png?token=qVRrqXZfaiPzkgrHbzVZ&branch=master)](https://travis-ci.org/dscout/velge)

# Velge |CHooz|

1. verb - Pick out or select as being the most appropriate of two or more alternatives.
2. noun - Nimble autocompleting tag management in javascript

![Velge Example](http://assets-dscoutapp-com.s3.amazonaws.com/velge_sample.png)

## Installation

The simplest way is via bower:

```bash
bower install velge
```

You'll then want to import the compiled `.js` and `.css`:

```html
<script src="/bower_components/velge/velge.min.js"></script>
```

## Usage

Velge can be attached to any container. The structure isn't of any importance:

```html
<div class='velge'></div>
```

Initialize velge with a selector for the container and customization options:

```javascript
var velge = new Velge($('.container'), {})
```

Any choices that are provided at initialization will be used to pre-populate
the dropdown and chosen lists.

### Loading Tags

All tag matching is performed locally. As such you must load in all possible
choices and an optional set of applied choices:

```javascript
velge
  .addChosen({ name: "Apple" })
  .addChosen({ name: "Juicy" })

velge
  .addChoice({ name: "Orange" })
  .addChoice({ name: "Berry" })
  .addChoice({ name: "Tangy" })
```

Tag objects can be anything that have a "name" property or method. Whatever
object is loaded is what will be passed to any callbacks.

It isn't always tidy to add choices and chosen separately. For convenience they can
also be loaded during construction:

```javascript
new Velge($selector,
  choices: [
    { name: "apple"  },
    { name: "pear"   },
    { name: "quince" }
  ],
  chosen: [
    { name: "kiwi" }
  ]
})
```

### Persisting

The velge instance exposes hooks for persisting changes after tags have been
added or removed:

```javascript
var addCallback = function(choice, velge) { /* Persist Me */ }
  , remCallback = function(choice, velge) { /* Destroy Me */ }

velge
  .onAdd(addCallback)
  .onRem(remCallback)
```

### Single Mode

While velge is designed as an interface for applying multiple "tags" to a
resource it can also operate in single mode. Under single mode only the most
recent tag will be kept, all others will be unchosen.

```javascript
var velge = new Velge($('.container'), { single: true })
```

### Error Handling

Because velge displays all tag additions instantly it can easily fall out of
sync with the underlying collection. If, for example, an ajax request fails you
can rollback the addition:

```javascript
var addCallback = function(choice, velge) {
  $.ajax({
    data: choice,
    type: "POST",
    url:  "/api/resource/1/tags"
  }).fail(function(error) {
    velge.remChosen(choice);
  })
}
```

## License

MIT, see `LICENSE.txt` for details.

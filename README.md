[![Build Status](https://travis-ci.org/dscout/velge.png?branch=master)](https://travis-ci.org/dscout/velge)

# Velge (ch•oose)

1. verb - Pick out or select as being the most appropriate of two or more alternatives.
2. noun - Nimble autocompleting tag management in javascript

![Velge Example](http://assets-dscoutapp-com.s3.amazonaws.com/velge_sample.png)

Velge is a nimble tag management widget. It is written in pure javascript, has
no dependencies, is fully tested with Mocha, and can be installed via NPM or
Bower.

Some of the features:

* Event emission for all state and ui events.
* Fuzzy pattern matching for searching.
* Customizable sorting, validation, normalization.
* Keyboard shortcuts for navigation, quick submission, and removal.

The library is very lightweight and constructed in a way that allows for easy
feature additions. We'd love more people to use it, request features, and
contribute!

## Installation

The simplest way is through NPM:

```bash
npm install velge --save
```

You'll then want to import the compiled `.js` and `.css`:

```html
<link href="/node_modules/velge/dist/velge.css" rel="stylesheet" type="text/css">
<script src="/node_modules/velge/dist/velge.min.js"></script>
```

If you prefer to import velge directly you can import it directly through
CommonJS:

```javascript
var velge = require('velge');
```

## Usage

Velge can be attached to any container. The structure isn't of any importance:

```html
<div class='velge'></div>
```

Initialize velge with a selector for the container and customization options:

```javascript
var container = document.getElementById('container');

var velge = new Velge(container, {
  placeholder: 'Choose'
});
```

Any choices that are provided at initialization will be used to pre-populate
the dropdown and chosen lists.

### Loading Tags

All tag matching is performed locally. As such you must load in all possible
choices and an optional set of chosen values:

```javascript
velge
  .add({ name: 'orange' })
  .add({ name: 'berry' })
  .add({ name: 'tangy' });

velge
  .choose({ name: 'apple' })
  .choose({ name: 'juicy' });

// Choices: 'orange', 'berry', 'tangy', 'apple', 'juicy'
```

Tag objects can be anything that have a "name" property. Whatever object is
loaded is what will be passed to any callbacks.

It isn't always tidy to add choices and chosen separately. For convenience they can
also be loaded during construction:

```javascript
new Velge(element, {
  choices: [
    { name: 'macintosh' },
    { name: 'cortland' }
  ],
  chosen: [
    { name: 'jonagold' },
    { name: 'snow sweet' }
  ]
});
```

### Persisting

The velge instance emits events for persisting changes after tags have been
added, chosen, rejected, or deleted.

```javascript
velge
  .on('add',    function(object) { console.log('added', object) })
  .on('choose', function(object) { console.log('chose', object) })
  .on('reject', function(object) { console.log('reject', object) })
  .on('delete', function(object) { console.log('deleted', object) });
```

You may prefer to save all changes at the same time, maybe via a more form-like
submit action. That can be achieved by using `getChosen`:

```javascript
var chosen = velge.getChosen();
var names  = chosen.map(function(choice) { return choice.name });
```

### Sorting

By default choices will be displayed in the order they were added. It is
possible to specify a sorting behavior during construction, or afterwards:

```javascript
var comparitor = function(a, b) {
  if (a.name > b.name)      { return 1;  }
  else if (a.name < b.name) { return -1; }
  else                      { return 0;  }
};

var velge = new Velge(element, {
  comparitor: comparitor
})

// Setting options will trigger an immediate re-sort
velge.setOptions({ comparitor: function(a, b) {
  if (a.createdAt > b.createdAt)      { return 1;  }
  else if (a.createdAt < b.createdAt) { return -1; }
  else                                { return 0;  }
});
```

### Limitation Mode

While velge is designed as an interface for applying multiple "tags" to a
resource it can also operate in single, limitation, mode. Under single mode only
the most recent tag will be kept, all others will be unchosen.

```javascript
var velge = new Velge(element, { limitation: true })
```

### Error Handling

Because velge displays all tag additions instantly it can easily fall out of
sync with the underlying collection. If, for example, an ajax request fails you
can rollback the addition:

```javascript
var addCallback = function(choice) {
  $.ajax({
    data: choice,
    type: "POST",
    url:  "/api/resource/1/tags"
  }).fail(function(error) {
    velge.reject(choice);
  })
};
```

## Development

The project is built with modules from NPM. Simply run:

```bash
npm install
```

Once all modules are installed you're all set to test, lint, or build.

```bash
npm run test  # scripts/test
npm run lint  # scripts/lint
npm run build # scripts/build
```

## License

MIT, see `LICENSE.txt` for details.

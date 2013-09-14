[![Build Status](https://travis-ci.org/dscout/velge.png?branch=master)](https://travis-ci.org/dscout/velge)

# Velge |Choose|

1. verb - Pick out or select as being the most appropriate of two or more alternatives.
2. noun - Nimble autocompleting tag management in javascript

![Velge Example](http://assets-dscoutapp-com.s3.amazonaws.com/velge_sample.png)

Velge is a nimble tag management widget. It is written in CoffeeScript, fully
tested with Mocha, depends only on jQuery, and can be installed via Bower. If
you have ever wanted a tag widget similar to label management in Pivotal
Tracker, velge is it.

Some of the features:

* Automatic sorting, validation, normalization
* Fuzzy pattern matching
* Keyboard shortcuts
* Very simple callback hooks for addition and removal

The library is very lightweight and constructed in a way that allows for easy
feature additions. We'd love more people to use it, request features, and
contribute!

## Installation

The simplest way is via bower:

```bash
bower install velge
```

You'll then want to import the compiled `.js` and `.css`:

```html
<link href="/bower_components/velge/velge.css" rel="stylesheet" type="text/css">
<script src="/bower_components/velge/velge.min.js"></script>
```

## Usage

Velge can be attached to any container. The structure isn't of any importance:

```html
<div class='velge'></div>
```

Initialize velge with a selector for the container and customization options:

```javascript
var velge = new Velge($('.container'), { placeholder: 'Choose' })
```

Any choices that are provided at initialization will be used to pre-populate
the dropdown and chosen lists.

## Example

There is an example page that sets up a few instances of velge to play with.
jQuery must be installed via bower for the examples to operate:

```bash
bower install jquery
```

Alernativly you can swap in jquery from a CDN if you don't have bower installed:

```html
<!-- replace this -->
<script src="../bower_components/jquery/jquery.js"></script>

<!-- with this -->
<script src="//code.jquery.com/jquery-2.0.3.min.js"></script>
```

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

You may prefer to save all changes at the same time, maybe via a more form-like
submit action. That can be achieved by using `getChosen`:

```javascript
var chosen = velge.getChosen(),
  , names  = chosen.map(function(choice) { return choice.name });
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

## Development

The project is built via [Grunt](http://gruntjs.com) and depdends on packages
installed with [Bower](http://bower.io). To contribute you'll need both
packages installed along with all required bower components.

```bash
npm install -g grunt-cli
npm install -g bower
npm install
bower install --dev
```

Once grunt, grunt-contrib, and bower components are installed you're all set to
compile, test, or release (compile minified).

```bash
grunt         # compile, test
grunt release # compile, test, minify
grunt watch   # compile lib and test on any change
```

## License

MIT, see `LICENSE.txt` for details.

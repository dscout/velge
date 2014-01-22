# v0.9.1

* Fix dropdown positioning with an empty list.

# v0.9.0

* Position the dropdown when filtering choices, the same as during navigation.
* Tollerate (ignore) null or undefined choice input during preload.
* Fully blur the input when `escape` is pressed while input is blank and there
  arent't any choices highlighted. That includes dropdowns.

# v0.8.2

* Correctly re-position the dropdown after choices are removed.

# v0.8.1

* Force the dropdown menu to always be below the bottom of the input.
* Always re-render the choices on escape. Corrects partial list being displayed
  after filtering.
* Stop propagation when `escape` is pressed. It is common for velge to be
  loaded inside of a modal, most of which will close when `escape` is pressed.

# v0.8.0

* Root object level version, `Velge.VERSION`.
* Change the behavior of "tab" to autocomplete and cycle through choices.
* Top level methods for extracting all choices and all chosen.
* Keyboard interface for highlighting chosen. Use left and right arrows to
  highlight chosen items.
* Keyboard interface for removing chosen. Backspace to highlight the last
  chosen item, backspace again to remove it.

# v0.7.1

* More reliable tag height and positioning.
* Define max-width on list to avoid overlap with handle.
* Enforce tag height and better vertical alignment.

# v0.7.0

* Emphasize characters that match during fuzzy search.
* Customizable placeholder value.
* Enforce "single" mode when clicking on choices directly.
* Remove placeholder class and styling from input. Caused unecessary padding.

# v0.6.2

* Callbacks setters accept a context object that will be used when calling.

# v0.6.1

* Use `Velge#remChosen` when un-choosing from the UI. This change ensures that
  then `onRem` callbacks are fired properly.
* Fix callback application, callback methods were being invoked with the choice
  passed as the `this` value.

# v0.6.0

* Add single choice mode.
* Show examples for single and multi modes.
* Prevent default keyboard.

# v0.5.2

* Prevent fuzzy matches from including chosen choices.

# v0.5.1

* Style fixes for line heights and positioning.

# v0.5.0

* Initial release, all basic functionality in place.

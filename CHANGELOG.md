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
